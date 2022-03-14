const { category } = require('../../models');

exports.getCategories = async (req, res) => {
  try {
    const data = await category.findAll({ attributes: ['id', 'name'] });

    let categories = data.map((item) => ({ text: item.name, value: item.id }));

    res.status(200).send({
      status: 'success',
      data: categories,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failed',
      message: 'Server error',
    });
  }
};
