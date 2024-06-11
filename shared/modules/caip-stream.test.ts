import { Duplex, PassThrough } from 'readable-stream';
import { deferredPromise } from '../../app/scripts/lib/util';
import { createCaipStream } from './caip-stream';

const writeToStream = async (stream: Duplex, message: unknown) => {
  const { promise: isWritten, resolve: writeCallback } = deferredPromise();

  stream.write(message, () => writeCallback());
  await isWritten;
};

const onData = (stream: Duplex): unknown[] => {
  const chunks: unknown[] = [];
  stream.on('data', (chunk: unknown) => {
    chunks.push(chunk);
  });

  return chunks;
};

class MockStream extends Duplex {
  chunks: unknown[] = [];

  constructor() {
    super({ objectMode: true });
  }

  _read() {
    return undefined;
  }

  _write(
    value: unknown,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ) {
    this.chunks.push(value);
    callback();
  }
}

describe('CAIP Stream', () => {
  describe('createCaipStream', () => {
    it('pipes and unwraps a caip-x message from source stream to the substream', async () => {
      const sourceStream = new PassThrough({ objectMode: true });
      const sourceStreamChunks = onData(sourceStream);

      const providerStream = createCaipStream(sourceStream);
      const providerStreamChunks = onData(providerStream);

      await writeToStream(sourceStream, {
        type: 'caip-x',
        data: { foo: 'bar' },
      });

      expect(sourceStreamChunks).toStrictEqual([
        { type: 'caip-x', data: { foo: 'bar' } },
      ]);
      expect(providerStreamChunks).toStrictEqual([{ foo: 'bar' }]);
    });

    it('pipes and wraps a message from the substream to the source stream', async () => {
      // using a fake stream here instead of PassThrough to prevent a loop
      // when sourceStream gets written back to at the end of the CAIP pipeline
      const sourceStream = new MockStream();

      const providerStream = createCaipStream(sourceStream);

      await writeToStream(providerStream, {
        foo: 'bar',
      });

      // Note that it's not possible to verify the output side of the internal SplitStream
      // instantiated inside createCaipStream as only the substream is actually exported
      expect(sourceStream.chunks).toStrictEqual([
        { type: 'caip-x', data: { foo: 'bar' } },
      ]);
    });
  });
});
