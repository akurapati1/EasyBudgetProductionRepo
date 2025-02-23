export default {
    post: jest.fn(() => Promise.resolve({ data: { token: 'test-token', user: { name: 'Test User' } } })),
  };
  