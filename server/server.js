const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'autodb',
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Error', err.message);
    } else {
      console.log('DB connected');
    }
  });
  

app.get('/api/brands', (req, res) => {
  db.query('SELECT * FROM ibrands', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/api/models/by-brand/:brandId', (req, res) => {
  const brandId = req.params.brandId;

  db.query(
    'SELECT * FROM imodels WHERE brand_id = ?',
    [brandId],
    (err, results) => {
      if (err) {
        console.error('Помилка при отриманні моделей:', err);
        return res.status(500).json({ error: 'Помилка сервера' });
      }
      res.json(results);
    }
  );
});

app.get('/api/generations/by-model/:modelId/brand/:brandId', (req, res) => {
  const modelId = req.params.modelId;
  const brandId = req.params.brandId;

  db.query(
    'SELECT * FROM igenerations WHERE model_id = ? AND brand_id = ?',
    [modelId, brandId],
    (err, results) => {
      if (err) {
        console.error('Помилка при отриманні поколінь:', err);
        return res.status(500).json({ error: 'Помилка сервера' });
      }
      res.json(results);
    }
  );
});

app.get('/api/modification/by-model/:modelId/brand/:brandId/generation/:generationId', (req, res) => {
  const modelId = req.params.modelId;
  const brandId = req.params.brandId;
  const generationId = req.params.generationId;

  db.query(
    'SELECT * FROM imodifications WHERE model_id = ? AND brand_id = ? AND generation_id',
    [modelId, brandId, generationId],
    (err, results) => {
      if (err) {
        console.error('Помилка при отриманні поколінь:', err);
        return res.status(500).json({ error: 'Помилка сервера' });
      }
      res.json(results);
    }
  );
});

app.get('/api/values/by-model/:modelId/brand/:brandId/generation/:generationId/modification/:modificationId', (req, res) => {
  const modelId = req.params.modelId;
  const brandId = req.params.brandId;
  const generationId = req.params.generationId;
  const modificationId = req.params.modificationId;

  db.query(
    'SELECT * FROM ivalues WHERE model_id = ? AND brand_id = ? AND generation_id = ? AND modification_id = ?',
    [modelId, brandId, generationId, modificationId],
    (err, results) => {
      if (err) {
        console.error('Помилка при отриманні характеристик:', err);
        return res.status(500).json({ error: 'Помилка сервера' });
      }
      res.json(results);
    }
  );
});

app.post('/api/cars', (req, res) => {
  const { brand_id, model_id, generation_id, modification_id } = req.body;

  db.query(
    'INSERT INTO cars (brand_id, model_id, generation_id, modification_id) VALUES (?, ?, ?, ?)',
    [brand_id, model_id, generation_id, modification_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ id: result.insertId });
    }
  );
});

app.get('/api/cars', (req, res) => {
  db.query('SELECT * FROM cars', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.get('/api/cars/:id', (req, res) => {
  const carId = req.params.id;

  db.query('SELECT * FROM cars WHERE id = ?', [carId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Автомобіль не знайдено' });
    res.json(results[0]);
  });
});

app.put('/api/cars/:id', (req, res) => {
  const carId = req.params.id;
  const { brand_id, model_id, generation_id, modification_id } = req.body;

  db.query(
    'UPDATE cars SET brand_id = ?, model_id = ?, generation_id = ?, modification_id = ? WHERE id = ?',
    [brand_id, model_id, generation_id, modification_id, carId],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Автомобіль не знайдено' });
      res.json({ message: 'Автомобіль оновлено' });
    }
  );
});

app.delete('/api/cars/:id', (req, res) => {
  const carId = req.params.id;

  db.query('DELETE FROM cars WHERE id = ?', [carId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Автомобіль не знайдено' });
    res.json({ message: 'Автомобіль видалено' });
  });
});

app.get('/api/models', (req, res) => {
  db.query('SELECT * FROM imodels', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/api/generations', (req, res) => {
  db.query('SELECT * FROM igenerations', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/api/modifications', (req, res) => {
  db.query('SELECT * FROM imodifications', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/api/characteristics', (req, res) => {
  db.query('SELECT * FROM ivalues', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/api/photos', (req, res) => {
  db.query('SELECT * FROM iphotos', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.listen(3001, () => {
  console.log('Server run on http://localhost:3001');
});
