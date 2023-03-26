const deterministicPartitionKey = require('../deterministicPartitionKey');

const crypto = require('crypto');

describe('deterministicPartitionKey', () => {
  it('returns "0" if event is undefined', () => {
    const expected = '0';
    const result = deterministicPartitionKey(undefined);
    expect(result).toBe(expected);
  });

  it('returns the partitionKey if it exists in the event', () => {
    const event = {
      partitionKey: 'myKey'
    };
    const expected = 'myKey';
    const result = deterministicPartitionKey(event);
    expect(result).toBe(expected);
  });

  it('returns a hash of the event if partitionKey is not present', () => {
    const event = {
      candidate: {
        name: 'John Doe'
      },
    };
    const result = deterministicPartitionKey(event);
    expect(typeof result).toBe('string');
  });

it('returns a hash of the stringified candidate if candidate is not a string', () => {
    const event = {
      candidate: {
        name: 'John Doe'
      }
    };
    const candidate = event.candidate;
    const expected = crypto.createHash('sha3-512').update(JSON.stringify(candidate)).digest('hex');
    const result = deterministicPartitionKey(event);
    expect(result).toBe(expected);
});

  it('returns a hash of the candidate if candidate length is greater than MAX_PARTITION_KEY_LENGTH', () => {
    const candidate = 'a'.repeat(300);
    const hash = crypto.createHash('sha3-512').update(candidate).digest('hex');
    const expected = hash.length <= 256 ? hash : crypto.createHash('sha3-512').update(hash).digest('hex');
    const result = deterministicPartitionKey({ candidate });
    expect(result).toBe(expected);
  });
});