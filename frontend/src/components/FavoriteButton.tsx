import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { StarIcon } from '@patternfly/react-icons';
import classNames from 'classnames';

import './FavoriteButton.scss';
import { ProjectKind } from '~/k8sTypes';
import { getDisplayNameFromK8sResource } from '~/concepts/k8s/utils';

export const isFavourite = (s: string): boolean => ['andrews-test', 'dsa', 'test123'].includes(s);

export const filterProjects = (a: ProjectKind, b: ProjectKind): number => {
  const hasA = isFavourite(a.metadata.name);
  const hasB = isFavourite(b.metadata.name);
  if (hasA && !hasB) {
    return -1;
  }
  if (hasB && !hasA) {
    return 1;
  }
  return getDisplayNameFromK8sResource(a).localeCompare(getDisplayNameFromK8sResource(b));
};

type FavoriteButtonProps = {
  isFavorite: boolean;
  onClick?: () => void;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onClick }) => {
  const starIcon = (
    <StarIcon
      className={classNames('odh-favorite-button__star-icon', {
        'odh-favorite-button__star-icon--is-selected': isFavorite,
      })}
    />
  );

  if (!onClick) {
    return starIcon;
  }

  return (
    <Button
      variant="plain"
      aria-label={isFavorite ? 'starred' : 'not starred'}
      className="odh-favorite-button"
      onClick={onClick}
    >
      {starIcon}
    </Button>
  );
};

export default FavoriteButton;
