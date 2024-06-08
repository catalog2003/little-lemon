import { useRef, useEffect } from 'react';

export function getSectionListData(data) {
  const restructured = data.reduce((acc, item) => {
    const category = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    const existingCategory = acc.find((x) => x.name === category);

    const newItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image,
    };

    if (existingCategory) {
      existingCategory.data.push(newItem);
    } else {
      acc.push({
        name: category,
        data: [newItem],
      });
    }

    return acc;
  }, []);

  // Sort categories alphabetically
  restructured.sort((a, b) => a.name.localeCompare(b.name));

  // Sort items within each category alphabetically by name
  restructured.forEach((category) =>
    category.data.sort((a, b) => a.name.localeCompare(b.name))
  );

  return restructured;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const cleanup = effect();
      return () => {
        if (cleanup && typeof cleanup === 'function') {
          cleanup();
        }
      };
    }
  }, dependencies);
}
