import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, Flex, FlexItem, Truncate } from '@patternfly/react-core';
import { Link, useSearchParams } from 'react-router-dom';
import ApplicationsPage from '~/pages/ApplicationsPage';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import GenericHorizontalBar from '~/pages/projects/components/GenericHorizontalBar';
import ProjectSharing from '~/pages/projects/projectSharing/ProjectSharing';
import ProjectSettingsPage from '~/pages/projects/projectSettings/ProjectSettingsPage';
import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';
import useModelServingEnabled from '~/pages/modelServing/useModelServingEnabled';
import { ProjectObjectType, SectionType } from '~/concepts/design/utils';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import { AccessReviewResourceAttributes } from '~/k8sTypes';
import { useAccessReview } from '~/api';
import { getDescriptionFromK8sResource, getDisplayNameFromK8sResource } from '~/concepts/k8s/utils';
import ResourceNameTooltip from '~/components/ResourceNameTooltip';
import HeaderIcon from '~/concepts/design/HeaderIcon';
import ModelServingContextProvider from '~/concepts/modelServing/foundation/ModelServingContext';
import ModelServingProjectTab from '~/concepts/modelServing/foundation/ModelServingProjectTab';
import { ProjectSectionTitles } from '~/pages/projects/screens/detail/const';
import useCheckLogoutParams from './useCheckLogoutParams';
import ProjectOverview from './overview/ProjectOverview';
import NotebookList from './notebooks/NotebookList';
import StorageList from './storage/StorageList';
import ConnectionsList from './connections/ConnectionsList';
import PipelinesSection from './pipelines/PipelinesSection';
import ProjectActions from './ProjectActions';
import './ProjectDetails.scss';

const accessReviewResource: AccessReviewResourceAttributes = {
  group: 'rbac.authorization.k8s.io',
  resource: 'rolebindings',
  verb: 'create',
};

const ProjectDetails: React.FC = () => {
  const { currentProject } = React.useContext(ProjectDetailsContext);
  const displayName = getDisplayNameFromK8sResource(currentProject);
  const description = getDescriptionFromK8sResource(currentProject);
  const biasMetricsAreaAvailable = useIsAreaAvailable(SupportedArea.BIAS_METRICS).status;
  const projectSharingEnabled = useIsAreaAvailable(SupportedArea.DS_PROJECTS_PERMISSIONS).status;
  const pipelinesEnabled = useIsAreaAvailable(SupportedArea.DS_PIPELINES).status;
  const modelServingEnabled = useModelServingEnabled();
  const [searchParams, setSearchParams] = useSearchParams();
  const state = searchParams.get('section');
  const [allowCreate, rbacLoaded] = useAccessReview({
    ...accessReviewResource,
    namespace: currentProject.metadata.name,
  });
  const workbenchEnabled = useIsAreaAvailable(SupportedArea.WORKBENCHES).status;

  useCheckLogoutParams();

  return (
    <ApplicationsPage
      title={
        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
          <HeaderIcon type={ProjectObjectType.projectContext} sectionType={SectionType.general} />
          <FlexItem flex={{ default: 'flex_1' }}>
            <ResourceNameTooltip resource={currentProject} wrap={false}>
              <Truncate content={displayName} />
            </ResourceNameTooltip>
          </FlexItem>
        </Flex>
      }
      description={<div style={{ marginLeft: 40 }}>{description}</div>}
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem render={() => <Link to="/projects">Data Science Projects</Link>} />
          <BreadcrumbItem isActive style={{ maxWidth: 300 }}>
            <Truncate content={displayName} />
          </BreadcrumbItem>
        </Breadcrumb>
      }
      loaded={rbacLoaded}
      empty={false}
      headerAction={<ProjectActions project={currentProject} />}
    >
      <GenericHorizontalBar
        activeKey={state}
        onSectionChange={React.useCallback(
          (sectionId, replace) => {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('section', sectionId);
            setSearchParams(newSearchParams, replace ? { replace } : undefined);
          },
          [searchParams, setSearchParams],
        )}
        sections={React.useMemo(
          () => [
            { id: ProjectSectionID.OVERVIEW, title: 'Overview', component: <ProjectOverview /> },
            ...(workbenchEnabled
              ? [
                  {
                    id: ProjectSectionID.WORKBENCHES,
                    title: 'Workbenches',
                    component: <NotebookList />,
                  },
                ]
              : []),
            ...(pipelinesEnabled
              ? [
                  {
                    id: ProjectSectionID.PIPELINES,
                    title: 'Pipelines',
                    component: <PipelinesSection />,
                  },
                ]
              : []),
            ...(modelServingEnabled
              ? [
                  {
                    id: ProjectSectionID.MODEL_SERVER,
                    title: 'Models',
                    component: (
                      <ModelServingContextProvider project={currentProject}>
                        <ModelServingProjectTab
                          pageTitle={ProjectSectionTitles[ProjectSectionID.MODEL_SERVER]}
                        />
                      </ModelServingContextProvider>
                    ),
                  },
                ]
              : []),
            {
              id: ProjectSectionID.CLUSTER_STORAGES,
              title: 'Cluster storage',
              component: <StorageList />,
            },
            {
              id: ProjectSectionID.CONNECTIONS,
              title: 'Connections',
              component: <ConnectionsList />,
            },
            ...(projectSharingEnabled && allowCreate
              ? [
                  {
                    id: ProjectSectionID.PERMISSIONS,
                    title: 'Permissions',
                    component: <ProjectSharing />,
                  },
                ]
              : []),
            ...(biasMetricsAreaAvailable && allowCreate
              ? [
                  {
                    id: ProjectSectionID.SETTINGS,
                    title: 'Settings',
                    component: <ProjectSettingsPage />,
                  },
                ]
              : []),
          ],
          [
            allowCreate,
            biasMetricsAreaAvailable,
            modelServingEnabled,
            pipelinesEnabled,
            projectSharingEnabled,
            workbenchEnabled,
          ],
        )}
      />
    </ApplicationsPage>
  );
};

export default ProjectDetails;
