import * as React from 'react';
import useGenericObjectState from '~/utilities/useGenericObjectState';
import { TrustyDBData } from '~/concepts/trustyai/types';
import { UpdateObjectAtPropAndValue } from '~/pages/projects/types';
import { getSecret } from '~/api';

export enum TrustyInstallModalFormType {
  EXISTING = 'existing',
  NEW = 'new',
}

export enum TrustyInstallModalFormExistingState {
  EXISTING = 'valid',
  NOT_FOUND = 'invalid',
  CHECKING = 'checking',
  UNSURE = 'unsure',
  UNKNOWN = 'unknown',
}
const EXISTING_NAME_FAIL_STATES = [
  TrustyInstallModalFormExistingState.NOT_FOUND,
  TrustyInstallModalFormExistingState.CHECKING,
  TrustyInstallModalFormExistingState.UNKNOWN,
];

type UseTrustyInstallModalDataBase = {
  canSubmit: boolean;
  onModeChange: (mode: TrustyInstallModalFormType) => void;
};
export type UseTrustyInstallModalDataNew = UseTrustyInstallModalDataBase & {
  type: TrustyInstallModalFormType.NEW;
  data: TrustyDBData;
  onDataChange: UpdateObjectAtPropAndValue<TrustyDBData>;
};
export type UseTrustyInstallModalDataExisting = UseTrustyInstallModalDataBase & {
  type: TrustyInstallModalFormType.EXISTING;
  data: string;
  onDataChange: (newValue: string) => void;
  state: TrustyInstallModalFormExistingState;
  onCheckState: () => void;
};

type UseTrustyInstallModalData = UseTrustyInstallModalDataNew | UseTrustyInstallModalDataExisting;

const useTrustyInstallModalData = (namespace: string): UseTrustyInstallModalData => {
  const [mode, setMode] = React.useState<TrustyInstallModalFormType>(
    TrustyInstallModalFormType.EXISTING,
  );

  const [existingValue, setExistingValue] = React.useState('');
  const [existingValid, setExistingValid] = React.useState<TrustyInstallModalFormExistingState>(
    TrustyInstallModalFormExistingState.UNKNOWN,
  );
  const onExistingChange = React.useCallback<UseTrustyInstallModalDataExisting['onDataChange']>(
    (value) => {
      setExistingValue(value);
      setExistingValid(TrustyInstallModalFormExistingState.UNKNOWN);
    },
    [],
  );
  const onCheckState = React.useCallback(() => {
    if (existingValue) {
      setExistingValid(TrustyInstallModalFormExistingState.CHECKING);
      getSecret(namespace, existingValue)
        .then(() => {
          setExistingValid(TrustyInstallModalFormExistingState.EXISTING);
        })
        .catch((e) => {
          if (e.statusObject?.code === 404) {
            setExistingValid(TrustyInstallModalFormExistingState.NOT_FOUND);
            return;
          }

          // eslint-disable-next-line no-console
          console.error('TrustyAI: Unknown error while validating the secret', e);
          setExistingValid(TrustyInstallModalFormExistingState.UNSURE);
        });
    } else {
      setExistingValid(TrustyInstallModalFormExistingState.UNKNOWN);
    }
  }, [existingValue, namespace]);

  const [dbFormData, onDbFormDataChange] = useGenericObjectState<TrustyDBData>({
    databaseKind: 'mariadb',
    databaseUsername: '',
    databasePassword: '',
    databaseService: 'mariadb',
    databasePort: '3306',
    databaseName: '',
    databaseGeneration: 'update',
  });

  switch (mode) {
    case TrustyInstallModalFormType.NEW:
      return {
        onModeChange: setMode,
        canSubmit: Object.values(dbFormData).every((v) => !!v),
        type: TrustyInstallModalFormType.NEW,
        data: dbFormData,
        onDataChange: onDbFormDataChange,
      };
    case TrustyInstallModalFormType.EXISTING:
    default:
      return {
        onModeChange: setMode,
        canSubmit:
          existingValue.trim().length > 0 && !EXISTING_NAME_FAIL_STATES.includes(existingValid),
        type: TrustyInstallModalFormType.EXISTING,
        data: existingValue,
        onDataChange: onExistingChange,
        state: existingValid,
        onCheckState,
      };
  }
};

export default useTrustyInstallModalData;