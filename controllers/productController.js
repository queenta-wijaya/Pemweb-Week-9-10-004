const { Prisma } = require('@prisma/client');
const prisma = require('../prismaClient');

function getId(req) {
  const id = Number(req.params.id);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function getValidatedProduct(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return null;
  }

  const { name, price } = body;
  if (
    typeof name !== 'string' ||
    name.trim().length === 0 ||
    typeof price !== 'number' ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    return null;
  }

  return { name: name.trim(), price };
}

function sendNotFound(res) {
  return res.status(404).json({
    status: 'error',
    message: 'Produk tidak ditemukan'
  });
}

function handleNotFoundError(error, res, next) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    return sendNotFound(res);
  }

  return next(error);
}

async function getProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' }
    });

    return res.json({
      status: 'success',
      message: 'Berhasil mengambil daftar produk',
      data: products
    });
  } catch (error) {
    return next(error);
  }
}

async function getProductById(req, res, next) {
  const id = getId(req);
  if (id === null) {
    return sendNotFound(res);
  }

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return sendNotFound(res);
    }

    return res.json({
      status: 'success',
      data: product
    });
  } catch (error) {
    return next(error);
  }
}

async function createProduct(req, res, next) {
  const product = getValidatedProduct(req.body);
  if (!product) {
    return res.status(400).json({
      status: 'error',
      message: 'Nama produk harus diisi dan harga harus berupa angka lebih dari 0'
    });
  }

  try {
    const newProduct = await prisma.product.create({ data: product });

    return res.status(201).json({
      status: 'success',
      message: 'Produk berhasil ditambahkan',
      data: newProduct
    });
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  const id = getId(req);
  const product = getValidatedProduct(req.body);
  if (id === null) {
    return sendNotFound(res);
  }
  if (!product) {
    return res.status(400).json({
      status: 'error',
      message: 'Nama produk harus diisi dan harga harus berupa angka lebih dari 0'
    });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: product
    });

    return res.json({
      status: 'success',
      message: 'Produk berhasil diperbarui',
      data: updatedProduct
    });
  } catch (error) {
    return handleNotFoundError(error, res, next);
  }
}

async function deleteProduct(req, res, next) {
  const id = getId(req);
  if (id === null) {
    return sendNotFound(res);
  }

  try {
    const deletedProduct = await prisma.product.delete({ where: { id } });

    return res.json({
      status: 'success',
      message: 'Produk berhasil dihapus',
      data: deletedProduct
    });
  } catch (error) {
    return handleNotFoundError(error, res, next);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
