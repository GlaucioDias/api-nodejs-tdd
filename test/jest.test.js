

test('primeiro teste com jest', () => {
  let number = null;
  expect(number).toBeNull();
  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9);
  expect(number).toBeLessThan(11);
});

test('segundo teste jest - objetos', () => {
  const obj = { name: 'Pedro', email: 'pedro@teste.com' };
  const obj2 = { name: 'Pedro', email: 'pedro@teste.com' };

  expect(obj).toHaveProperty('name');
  expect(obj).toHaveProperty('name', 'Pedro');
  expect(obj.name).toBe('Pedro');
  expect(obj).toEqual(obj2);
  expect(obj).toEqual(obj);
});
