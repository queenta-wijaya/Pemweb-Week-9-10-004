const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const app = require('../server');
const prisma = require('../prismaClient');

let server;
let baseUrl;
let createdProductId;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await prisma.$disconnect();
});

test('CRUD produk tersimpan melalui Prisma', async (t) => {
  await t.test('GET /products mengembalikan produk awal', async () => {
    const response = await fetch(`${baseUrl}/products`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(body.data.some((product) => product.id === 1 && product.name === 'Buku'));
    assert.ok(body.data.some((product) => product.id === 2 && product.name === 'Pulpen'));
  });

  await t.test('GET /products/1 mengembalikan produk Buku', async () => {
    const response = await fetch(`${baseUrl}/products/1`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body.data, { id: 1, name: 'Buku', price: 15000 });
  });

  await t.test('GET /products/999 mengembalikan JSON 404', async () => {
    const response = await fetch(`${baseUrl}/products/999`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.deepEqual(body, {
      status: 'error',
      message: 'Produk tidak ditemukan'
    });
  });

  await t.test('POST /products menolak input tidak valid', async () => {
    const response = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Penggaris' })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.status, 'error');
  });

  await t.test('POST /products membuat produk dan mengembalikan status 201', async () => {
    const existingProducts = await prisma.product.findMany({
      select: { id: true }
    });
    const nextId = Math.max(0, ...existingProducts.map((product) => product.id)) + 1;
    await prisma.$executeRaw`UPDATE sqlite_sequence SET seq = ${nextId + 10} WHERE name = 'Product'`;

    const response = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Penggaris', price: 3000 })
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.data.name, 'Penggaris');
    assert.equal(body.data.price, 3000);
    assert.equal(body.data.id, nextId);
    createdProductId = body.data.id;
  });

  await t.test('PUT /products/:id memperbarui produk yang ada', async () => {
    const response = await fetch(`${baseUrl}/products/${createdProductId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Penggaris Besi', price: 4500 })
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body.data, {
      id: createdProductId,
      name: 'Penggaris Besi',
      price: 4500
    });

    const detailResponse = await fetch(`${baseUrl}/products/${createdProductId}`);
    const detailBody = await detailResponse.json();

    assert.equal(detailResponse.status, 200);
    assert.deepEqual(detailBody.data, body.data);
  });

  await t.test('PUT /products/:id menolak body tidak valid', async () => {
    const response = await fetch(`${baseUrl}/products/${createdProductId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', price: -1 })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.status, 'error');
  });

  await t.test('PUT /products/:id mengembalikan 404 untuk ID yang tidak ada', async () => {
    const response = await fetch(`${baseUrl}/products/999999`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Produk', price: 1000 })
    });

    assert.equal(response.status, 404);
  });

  await t.test('DELETE /products/:id menghapus produk', async () => {
    const response = await fetch(`${baseUrl}/products/${createdProductId}`, {
      method: 'DELETE'
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.data.id, createdProductId);

    const detailResponse = await fetch(`${baseUrl}/products/${createdProductId}`);
    assert.equal(detailResponse.status, 404);
  });

  await t.test('POST menggunakan ulang ID setelah produk tertinggi dihapus', async () => {
    const existingProducts = await prisma.product.findMany({
      select: { id: true }
    });
    const nextId = Math.max(0, ...existingProducts.map((product) => product.id)) + 1;
    const response = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Produk Uji ID', price: 1000 })
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.data.id, nextId);

    const deleteResponse = await fetch(`${baseUrl}/products/${body.data.id}`, {
      method: 'DELETE'
    });
    assert.equal(deleteResponse.status, 200);
  });

  await t.test('DELETE /products/:id mengembalikan 404 untuk ID yang tidak ada', async () => {
    const response = await fetch(`${baseUrl}/products/999999`, {
      method: 'DELETE'
    });

    assert.equal(response.status, 404);
  });
});
