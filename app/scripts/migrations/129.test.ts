import { migrate, version } from './124';

const oldVersion = 128;

describe('migration #129', () => {
  it('updates the version metadata', async () => {
    const oldStorage = {
      meta: { version: oldVersion },
      data: {},
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage.meta).toStrictEqual({ version });
  });

  it('does nothing if no preferences controller state is set', async () => {
    const oldState = {
      OtherController: {},
    };

    const transformedState = await migrate({
      meta: { version: oldVersion },
      data: oldState,
    });

    expect(transformedState.data).toEqual(oldState);
  });

  it('adds property if migration runs', async () => {
    const oldState = {
      PreferencesController: {
        preferences: {
          showMultiRpcModal: true,
        },
      },
    };

    const expectedState = {
      PreferencesController: {
        preferences: {
          redesignedTransactionsEnabled: false,
          showMultiRpcModal: true,
        },
      },
    };

    const transformedState = await migrate({
      meta: { version: oldVersion },
      data: oldState,
    });

    expect(transformedState.data).toEqual(expectedState);
  });
});
