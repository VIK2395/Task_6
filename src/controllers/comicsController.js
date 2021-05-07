const Comics = require('../models/Comics');

const comics_get_all = async (req, res) => {
  try {
    if (req.query.search === 'true' && req.query.title) {
      const comics = await Comics.find({ title: { $regex: req.query.title, $options: 'i' } });
      return res.json({ comics });
    }

    if (req.query.sort === 'asc') {
      const comicses = await Comics.find().sort({ title: 1 });
      return res.json(comicses);
    }

    if (req.query.sort === 'desc') {
      const comicses = await Comics.find().sort({ title: -1 });
      return res.json(comicses);
    }

    const comicses = await Comics.find();
    res.json(comicses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const comics_get_one = async (req, res) => {
  try {
    const comics = await Comics.findById(req.params.id); // null

    if (!comics) {
      return res.status(404).json({ message: 'Comics with such an id not found' });
    }
    res.json({ comics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const comics_post = async (req, res) => {
  try {
    const comics = new Comics({
      title: req.body.title,
      logo: `http://localhost:5000/${req.file.path}`,
      publisher: req.body.publisher,
      author: req.body.author,
      characters: req.body.characters,
      rating: req.body.rating,
    });

    await comics.save();

    res.status(201).json({ comics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const comics_put = async (req, res) => {
  try {
    const comics = await Comics.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        logo: `http://localhost:5000/${req.file.path}`,
        publisher: req.body.publisher,
        author: req.body.author,
        characters: req.body.characters,
        rating: req.body.rating,
      },
      { new: true }
    );

    if (!comics) {
      return res.status(404).json({ message: 'Comics with such an id not found' });
    }

    res.json({ comics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const comics_delete = async (req, res) => {
  try {
    const comics = await Comics.findByIdAndDelete(req.params.id);

    if (!comics) {
      return res.status(404).json({ message: 'Comics with such an id not found' });
    }
    res.json({ message: 'Comics deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  comics_get_all,
  comics_get_one,
  comics_post,
  comics_put,
  comics_delete,
};
