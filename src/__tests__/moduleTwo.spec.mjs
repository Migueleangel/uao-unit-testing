import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  describe, it, expect,
} from '@jest/globals';
import { generateFibonacciSequence, getUsers } from '../moduleTwo.mjs';

// Configuramos el mock de axios
const mock = new MockAdapter(axios);

describe('generateFibonacciSequence', () => {
  it('generates Fibonacci sequence correctly', () => {
    const result = generateFibonacciSequence(10);
    // Ajustar la secuencia esperada para iniciar con 0
    expect(result).toEqual([0, 1, 1, 2, 3, 5, 8, 13]);
  });

  it('throws an error for limit less than or equal to 0', () => {
    expect(() => generateFibonacciSequence(0)).toThrow('Limit must be greater than 0');
  });
});

describe('getUsers', () => {
  it('fetches successfully data from an API', async () => {
    const mockData = [{ name: 'John' }, { name: 'Jane' }];
    mock.onGet('https://jsonplaceholder.typicode.com/users').reply(200, mockData);

    const result = await getUsers();
    expect(result).toEqual(mockData);
  });

  it('throws an error if no users are found', async () => {
    mock.onGet('https://jsonplaceholder.typicode.com/users').reply(200, []);

    await expect(getUsers()).rejects.toThrow('No users found');
  });

  it('throws an error if Clementine is found', async () => {
    const mockData = [{ name: 'Clementine' }];
    mock.onGet('https://jsonplaceholder.typicode.com/users').reply(200, mockData);

    await expect(getUsers()).rejects.toThrow('Clementine is not allowed');
  });
});

// Limpiamos el mock después de cada prueba
