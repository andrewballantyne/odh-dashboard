import { SortableData } from '~/components/table';
import { ProjectKind } from '~/k8sTypes';
import { getProjectCreationTime } from '~/concepts/projects/utils';
import { getDisplayNameFromK8sResource } from '~/concepts/k8s/utils';
import { filterProjects } from '~/components/FavoriteButton';

export const columns: SortableData<ProjectKind>[] = [
  {
    field: 'project',
    label: 'Project',
    sortable: false,
    colSpan: 2,
    hasRightBorder: true,
    width: 50,
  },
  {
    field: 'Workbenches',
    label: 'Workbenches',
    sortable: false,
    colSpan: 2,
    hasRightBorder: true,
    width: 40,
  },
  {
    field: 'kebab',
    label: '',
    sortable: false,
    rowSpan: 2,
    width: 10,
  },
];
export const subColumns: SortableData<ProjectKind>[] = [
  {
    field: 'name',
    label: 'Name',
    sortable: filterProjects,
    width: 30,
  },
  {
    field: 'created',
    label: 'Created',
    sortable: (a, b) => getProjectCreationTime(a) - getProjectCreationTime(b),
    hasRightBorder: true,
    width: 20,
  },
  {
    field: 'workbench-name',
    label: 'Name',
    sortable: false,
    width: 10,
  },
  {
    field: 'workbench-status',
    label: 'Status',
    sortable: false,
    hasRightBorder: true,
    width: 10,
  },
];
