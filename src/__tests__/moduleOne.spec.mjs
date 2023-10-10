import axios from 'axios';
import {
  describe, it, expect, jest,
} from '@jest/globals';
import { divide, getPosts } from '../moduleOne.mjs';

jest.mock('axios'); // Movemos jest.mock aquí

describe('divide function', () => {
  it('should divide two numbers', () => {
    expect(divide(6, 2)).toBe(3);
  });

  it('should throw an error when dividing by zero', () => {
    expect(() => {
      divide(6, 0);
    }).toThrow('Error dividing by zero');
  });
});

describe('getPosts function', () => {
  it('should fetch posts successfully', async () => {
    const data = [/* your sample data here */];
    jest.spyOn(axios, 'get').mockResolvedValue({ status: 200, data }); // Usamos jest.spyOn

    const result = await getPosts();
    expect(result).toEqual(data);
  });

  it('should throw an error on non-200 status code', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ status: 404 });

    await expect(getPosts()).rejects.toThrow('Error fetching posts');
  });

  it('should throw an error if data is not an array', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ status: 200, data: {} });

    await expect(getPosts()).rejects.toThrow('Data is not an array');
  });

  it('should throw an error if data is an empty array', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ status: 200, data: [] });

    await expect(getPosts()).rejects.toThrow('No posts found');
  });

  it('should throw an error if data has more than 10 posts', async () => {
    const data = Array.from({ length: 11 }, (_, i) => ({ id: i }));
    jest.spyOn(axios, 'get').mockResolvedValue({ status: 200, data });

    await expect(getPosts()).rejects.toThrow('Too many posts');
  });
});
