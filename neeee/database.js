import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS menuitems (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            image TEXT,
            category TEXT
          );`,
          [],
          () => resolve(true),
          (_, error) => {
            console.error("Error creating table:", error);
            reject(error);
          }
        );
      }
    );
  });
}

export function getMenuItems() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM menuitems;',
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => {
            console.error("Error fetching menu items:", error);
            reject(error);
          }
        );
      }
    );
  });
}

export function saveMenuItems(menuItems) {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        const placeholders = menuItems.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
        const values = menuItems.flatMap(item => [item.id, item.name, item.price, item.description, item.image, item.category]);

        tx.executeSql(
          `INSERT INTO menuitems (id, name, price, description, image, category) VALUES ${placeholders};`,
          values,
          () => resolve(true),
          (_, error) => {
            console.error("Error saving menu items:", error);
            reject(error);
          }
        );
      }
    );
  });
}

export function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        const categoryPlaceholders = activeCategories.map(() => '?').join(', ');
        const sql = `SELECT * FROM menuitems WHERE name LIKE ? AND category IN (${categoryPlaceholders});`;
        const values = [`%${query}%`, ...activeCategories];

        tx.executeSql(
          sql,
          values,
          (_, { rows }) => resolve(rows._array),
          (_, error) => {
            console.error("Error filtering menu items:", error);
            reject(error);
          }
        );
      }
    );
  });
}
