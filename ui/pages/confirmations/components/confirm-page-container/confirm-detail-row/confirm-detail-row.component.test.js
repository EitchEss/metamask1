import React from 'react';
import configureMockStore from 'redux-mock-store';
import { NetworkStatus } from '@metamask/network-controller';
import { NetworkType } from '@metamask/controller-utils';
import defaultMockState from '../../../../../../test/data/mock-state.json';
import { renderWithProvider } from '../../../../../../test/lib/render-helpers';
import {
  CHAIN_IDS,
  GOERLI_DISPLAY_NAME,
  NETWORK_TYPES,
} from '../../../../../../shared/constants/network';
import ConfirmDetailRow from '.';

describe('Confirm Detail Row Component', () => {
  const mockState = {
    metamask: {
      currencyRates: {},
      networkConfigurationsByChainId: {
        [CHAIN_IDS.GOERLI]: {
          chainId: CHAIN_IDS.GOERLI,
          rpcEndpoints: [{}],
        },
      },
      preferences: {
        useNativeCurrencyAsPrimaryCurrency: true,
      },
      networksMetadata: {
        [NetworkType.mainnet]: {
          EIPS: {},
          status: NetworkStatus.Available,
        },
      },
      internalAccounts: defaultMockState.metamask.internalAccounts,
    },
  };

  const store = configureMockStore()(mockState);

  it('should match snapshot', () => {
    const { container } = renderWithProvider(<ConfirmDetailRow />, store);

    expect(container).toMatchSnapshot();
  });
});
