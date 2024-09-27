const Offert = require('../models/offerts.model.js');
const Category = require('../models/categorys.model.js');
const Enterprise = require('../models/enterprises.model.js'); // Importar el modelo de empresa
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

// CREATE NUEVA OFFERT
const createOffert = asyncHandler(async (req, res) => {
    const { title, company, location, description, requirements, salary, image, categorySlug } = req.body;

    // Validar si la categoría existe utilizando el slug
    const categoryObj = await Category.findOne({ slug: categorySlug }).exec();
    if (!categoryObj) {
        return res.status(400).json({ error: 'Categoría no encontrada' });
    }

<<<<<<< HEAD
    // Buscar la empresa por nombre
    const enterprise = await Enterprise.findOne({ name: company }).exec();
    if (!enterprise) {
        return res.status(400).json({ error: 'Empresa no encontrada' });
    }

    const randomToken = Math.random().toString(36).substring(2, 8);
=======
    // Crear nueva oferta
    const randomToken = Math.random().toString(36).substring(2, 8); // Token aleatorio de 6 caracteres
>>>>>>> parent of fb8a6c6 (Merge pull request #13 from 2-DAW-PROJECTS/alfosan)
    const newOffert = new Offert({
        title,
        company: enterprise.name,  // Guardar el nombre de la empresa
        company_slug: enterprise.slug,  // Guardar el slug de la empresa
        location,
        description,
        requirements,
        salary,
        category: categoryObj._id,
        slug: `${slugify(title, { lower: true })}-${randomToken}`,
        image, 
        categorySlug: categoryObj.slug // Establecer el slug de la categoría
    });

    const savedOffert = await newOffert.save();
    res.status(201).json(savedOffert);
});

// FIND ALL OFFERTS
const findAllOfferts = asyncHandler(async (req, res) => {
    let query = {};
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const title = req.query.title || '';

    if (title) {
        query.title = { $regex: new RegExp(title, 'i') };
    }

    const offerts = await Offert.find(query).limit(limit).skip(offset);
    const offertCount = await Offert.countDocuments(query);

    return res.status(200).json({ offerts, count: offertCount });
});

// FIND ONE OFFERT
const findOneOffert = asyncHandler(async (req, res) => {
    const offert = await Offert.findOne({ slug: req.params.slug });

    if (!offert) {
        return res.status(404).json({ message: 'Offert not found' });
    }

    return res.status(200).json(offert);
});

// DELETE ONE OFFERT
const deleteOneOffert = asyncHandler(async (req, res) => {
    const result = await Offert.deleteOne({ slug: req.params.slug });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Offert not found' });
    }

    return res.status(200).json({ message: 'Offert deleted' });
});

// UPDATE OFFERT
const updateOffert = asyncHandler(async (req, res) => {
    const updatedOffert = await Offert.findOneAndUpdate(
        { slug: req.params.slug },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedOffert) {
        return res.status(404).json({ message: 'Offert not found' });
    }

    return res.status(200).json(updatedOffert);
});

// FILTRAR OFERTAS POR CATEGORÍA Y SLUG DE EMPRESA
const filterOffert = asyncHandler(async (req, res) => {
    console.log('Filtrando ofertas...');
    const { categorySlug, companySlug } = req.query;

    let query = {};

    // Si se proporciona categorySlug, buscaremos la categoría
    if (categorySlug) {
        const category = await Category.findOne({ slug: categorySlug }).exec();
        if (category) {
            query.category = category._id; // Si existe la categoría, la agregamos a la consulta
        } else {
            return res.status(400).json({ message: 'Categoría no encontrada.' });
        }
    }

    // Si se proporciona companySlug, lo agregamos a la consulta
    if (companySlug) {
        query.company_slug = companySlug;
    }

    try {
        const offerts = await Offert.find(query).exec();
        if (offerts.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ofertas para esta categoría y/o empresa' });
        }

        return res.status(200).json(offerts);
    } catch (error) {
        console.error('Error al buscar las ofertas:', error);
        return res.status(500).json({ message: 'Error al buscar las ofertas' });
    }
});

// EXPORT MODULE
module.exports = {
    createOffert,
    findAllOfferts,
    findOneOffert,
    filterOffert,
    deleteOneOffert,
    updateOffert,
};
