const crypto = require("crypto");
const MAX_PARTITION_KEY_LENGTH = 256;
const TRIVIAL_PARTITION_KEY = "0";
/**
 * Generates a deterministic partition key for a given event object.
 * If an event object is provided with a 'partitionKey' property, that value is used.
 * Otherwise, the event object is hashed using the SHA3-512 algorithm and the resulting
 * hash is used as the partition key. If the resulting key is longer than 256 characters,
 * it is hashed again to ensure it is within the maximum allowed length.
 * @param {Object} event - The event object to generate a partition key for.
 * @returns {string} The generated partition key.
 */
function deterministicPartitionKey(event) {

  let candidate;

  if (event?.partitionKey) {
    candidate = event.partitionKey;
  } else if (event) {
    if (typeof event.candidate !== 'string') {
      event.candidate = JSON.stringify(event.candidate);
    }
    candidate = crypto.createHash("sha3-512").update(event.candidate).digest("hex");
  }

  if (candidate && typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }

  candidate = candidate?.toString() ?? TRIVIAL_PARTITION_KEY;

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  return candidate;
}

module.exports = deterministicPartitionKey;