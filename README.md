# 🔎 Find Duplicates – Directus Custom Interface

A custom **Directus interface** to easily detect duplicate entries within a collection, based on one or more selected fields.

---

## ⚙️ Features

- Select any collection.
- Choose one or multiple fields to check for duplicates.
- Fetch and display groups of items sharing identical values.
- Direct links to open duplicated items in the Directus admin panel.

---

## 🌍 Internationalization

Available in **English** and **French**. The interface automatically uses the default language configured in your Directus settings.

---

## 📸 Interface Preview

This interface can be used in a custom admin view or moderation dashboard to quickly identify and manage duplicate records.

---

## 🧠 Notes

- Values are normalized using `.toString().trim().toLowerCase()` before comparison.
- Only non-system collections are listed.
- Uses the Directus API with `limit: -1` to fetch all items.
- Duplicate groups are displayed with field values and quick-access links to each item.

---

## 🤝 Contributions

Pull requests are welcome!

---

## 📜 License

MIT
