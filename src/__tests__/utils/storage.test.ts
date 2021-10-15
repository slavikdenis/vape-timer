import * as Storage from '../../utils/storage';

describe('storage utilities', () => {
  afterAll(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  const KEY_NON_EXISTING = 'foo' as Storage.StorageKeys;
  const KEY_NON_EXISTING_2 = 'bar' as Storage.StorageKeys;
  const KEY_STRING = 'foo_string' as Storage.StorageKeys;
  const VALUE_STRING = 'bar';
  const KEY_OBJ = 'foo_object' as Storage.StorageKeys;
  const VALUE_OBJ = { foo: 'bar' };

  it('set', () => {
    Storage.set(KEY_STRING, VALUE_STRING);
    expect(localStorage.setItem).toHaveBeenCalledWith(KEY_STRING, VALUE_STRING);
    expect(localStorage.__STORE__[KEY_STRING]).toBe(VALUE_STRING);
    expect(Object.keys(localStorage.__STORE__).length).toBe(1);

    Storage.set(KEY_OBJ, VALUE_OBJ);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      KEY_OBJ,
      JSON.stringify(VALUE_OBJ),
    );
    expect(localStorage.__STORE__[KEY_OBJ]).toBe(JSON.stringify(VALUE_OBJ));
    expect(Object.keys(localStorage.__STORE__).length).toBe(2);
  });

  it('get', () => {
    const val_string = Storage.get(KEY_STRING, { shouldParse: false });
    expect(localStorage.getItem).toHaveBeenCalledWith(KEY_STRING);
    expect(val_string).toBe(VALUE_STRING);

    const val_obj = Storage.get(KEY_OBJ);
    expect(localStorage.getItem).toHaveBeenCalledWith(KEY_OBJ);
    expect(val_obj).toStrictEqual(VALUE_OBJ);

    const val_null = Storage.get(KEY_NON_EXISTING);
    expect(localStorage.getItem).toHaveBeenCalledWith(KEY_NON_EXISTING);
    expect(val_null).toBeNull();

    const val_null_2 = Storage.get(KEY_NON_EXISTING, { shouldParse: true });
    expect(localStorage.getItem).toHaveBeenCalledWith(KEY_NON_EXISTING);
    expect(val_null_2).toBeNull();

    const val_null_3 = Storage.get(KEY_NON_EXISTING_2, { shouldParse: false });
    expect(localStorage.getItem).toHaveBeenCalledWith(KEY_NON_EXISTING_2);
    expect(val_null_3).toBeNull();
  });

  it('remove', () => {
    Storage.remove(KEY_STRING);
    expect(localStorage.removeItem).toHaveBeenCalledWith(KEY_STRING);
    expect(Object.keys(localStorage.__STORE__).length).toBe(1);

    Storage.remove(KEY_OBJ);
    expect(localStorage.removeItem).toHaveBeenCalledWith(KEY_OBJ);
    expect(Object.keys(localStorage.__STORE__).length).toBe(0);
  });
});
