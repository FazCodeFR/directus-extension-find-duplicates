# 🔎 Find Duplicates – Directus Custom Interface

A custom **Directus interface** to easily detect duplicate entries within a collection, based on one or more selected fields.

---

## ⚙️ Features

- Select any collection.
- Choose one or multiple fields to check for duplicates.
- Fetch and display groups of items sharing identical values.
- Direct links to open duplicated items.
- Internationalization : Available in English and French.

---

## 📦 Installation Via Directus Marketplace
Install directly from the **Directus Marketplace**:
[http://YourDirectusUrl:8055/admin/settings/marketplace/extension/your-extension-id](http://YourDirectusUrl:8055/admin/settings/marketplace/extension/your-extension-id)
Or search for `"find duplicates"` in the marketplace.

Don't forget to go to settings > settings > Modules bars > activate the "Find Duplicates" module to display it in the side menu.


---

## 📸 Interface Preview

![Directus Module Extension Duplicates](https://github.com/FazCodeFR/directus-extension-find-duplicates/raw/main/Screenshot.png)

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
