import React from 'react';
import { Switch } from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons';
import useNotification from '~/utilities/useNotification';
import { HardwareProfileModel, toggleHardwareProfileEnablement } from '~/api';
import { HardwareProfileKind } from '~/k8sTypes';
import { HardwareProfileWarningType } from '~/concepts/hardwareProfiles/types';
import { AccessAllowed, useAccessAllowed, verbModelAccess } from '~/concepts/userSSAR';
import { validateProfileWarning } from './utils';

type HardwareProfileEnableToggleProps = {
  hardwareProfile: HardwareProfileKind;
};

const HardwareProfileEnableToggle: React.FC<HardwareProfileEnableToggleProps> = ({
  hardwareProfile,
}) => {
  const hardwareProfileWarnings = validateProfileWarning(hardwareProfile);
  const { enabled } = hardwareProfile.spec;
  const warning = hardwareProfileWarnings.some(
    (hardwareProfileWarning) => hardwareProfileWarning.type === HardwareProfileWarningType.OTHER,
  );
  const [isLoading, setLoading] = React.useState(false);
  const notification = useNotification();

  const handleChange = (checked: boolean) => {
    setLoading(true);
    toggleHardwareProfileEnablement(
      hardwareProfile.metadata.name,
      hardwareProfile.metadata.namespace,
      checked,
    )
      .catch((e) => {
        notification.error(
          `Error ${checked ? 'enable' : 'disable'} the hardware profile`,
          e.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AccessAllowed
      resourceAttributes={verbModelAccess('patch', HardwareProfileModel)}
      noAccessRender={() => enabled && !warning && <CheckIcon />}
    >
      {() => (
        <Switch
          aria-label={enabled ? 'enabled' : 'stopped'}
          data-testid="enable-switch"
          id={`${hardwareProfile.metadata.name}-enable-switch`}
          isChecked={enabled && !warning}
          isDisabled={warning || isLoading}
          onChange={(_e, checked) => handleChange(checked)}
        />
      )}
    </AccessAllowed>
  );
};

export default HardwareProfileEnableToggle;
