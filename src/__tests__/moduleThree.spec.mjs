import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect } from '@jest/globals';
import { sortNumbers, getTodos } from '../moduleThree.mjs';

// Configuramos el mock de axios
const mock = new MockAdapter(axios);

describe('sortNumbers', () => {
  it('sorts numbers in ascending order', () => {
    const numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
    const result = sortNumbers(numbers);
    const expected = [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9];
    expect(result).toEqual(expected);
  });

  it('throws an error if no numbers are provided', () => {
    expect(() => sortNumbers([])).toThrow('No numbers provided');
  });
});

describe('getTodos', () => {
  it('fetches todos successfully from an API', async () => {
    const mockData = [{
      userId: 1, id: 1, title: 'Todo 1', completed: true,
    }];
    mock.onGet('https://jsonplaceholder.typicode.com/todos').reply(200, mockData);

    const result = await getTodos();
    expect(result).toEqual(mockData);
  });

  it('throws an error if API request fails', async () => {
    mock.onGet('https://jsonplaceholder.typicode.com/todos').reply(500);

    await expect(getTodos()).rejects.toThrow('Request failed with status code 500');
  });

  it('throws an error if no todos are found', async () => {
    mock.onGet('https://jsonplaceholder.typicode.com/todos').reply(200, []);

    await expect(getTodos()).rejects.toThrow('No todos found');
  });

  it('throws an error if no completed todos are found', async () => {
    const mockData = [{
      userId: 1, id: 1, title: 'Todo 1', completed: false,
    }];
    mock.onGet('https://jsonplaceholder.typicode.com/todos').reply(200, mockData);

    await expect(getTodos()).rejects.toThrow('No completed todos found');
  });

  it('throws an error if response status is not 200', async () => {
    mock.onGet('https://jsonplaceholder.typicode.com/todos').reply(404);

    await expect(getTodos()).rejects.toThrow('Request failed with status code 404');
  });
});
