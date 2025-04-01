import * as React from 'react';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import {
  Alert,
  Content,
  Flex,
  FlexItem,
  Gallery,
  GalleryItem,
  Popover,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import DashboardPopupIconButton from '~/concepts/dashboard/DashboardPopupIconButton';
import DetailsSection from '~/pages/projects/screens/detail/DetailsSection'; // TODO: pages import is weird
import EmptyDetailsView from '~/components/EmptyDetailsView';
import { ProjectObjectType, typedEmptyImage } from '~/concepts/design/utils';
import EmptyModelServingPlatform from '~/concepts/modelServing/shared/EmptyModelServingPlatform';
import { ModelServingContext } from '~/concepts/modelServing/foundation/ModelServingContext';
import useDetermineProjectServingPlatform from '~/concepts/modelServing/foundation/useDetermineProjectServingPlatform';
import { ServingLabel, ProjectEnableCards } from '~/concepts/modelServing/platforms/exports';
import useAvailableServingPlatforms from '~/concepts/modelServing/foundation/useAvailableServingPlatforms';
import { trimForActiveServing } from '~/concepts/modelServing/foundation/utils';
import ModelServingPlatformSelectButton from '~/concepts/modelServing/shared/ModelServingPlatformSelectButton';
import ModelServingPlatformSelectErrorAlert from '~/concepts/modelServing/shared/ModelServingPlatformSelectErrorAlert';
import { NamespaceApplicationCase } from '~/concepts/projects/const';

type ModelServingProjectTabProps = Pick<
  React.ComponentProps<typeof DetailsSection>,
  'objectType' | 'id' | 'title'
>;

const ModelServingProjectTab: React.FC<ModelServingProjectTabProps> = ({
  objectType,
  id,
  title,
}) => {
  const [errorSelectingPlatform, setErrorSelectingPlatform] = React.useState<Error>();
  const {
    project,
    servingRuntimes: {
      data: servingRuntimes,
      loaded: servingRuntimesLoaded,
      error: servingRuntimeError,
    },
    servingRuntimeTemplates: [, templatesLoaded, templateError],
  } = React.useContext(ModelServingContext);

  const availableServingPlatforms = useAvailableServingPlatforms();
  const servingPlatform = useDetermineProjectServingPlatform(project);
  const ServingPlatformLabel = servingPlatform ? ServingLabel[servingPlatform] : null;
  const SelectServingCards = trimForActiveServing(ProjectEnableCards, availableServingPlatforms);

  console.debug(
    'Data',
    '\n\tavailableServingPlatforms',
    availableServingPlatforms,
    '\n\tservingPlatform',
    servingPlatform,
    '\n\t----',
  );

  const shouldShowPlatformSelection = availableServingPlatforms.length !== 1 && !servingPlatform;

  const emptyModelServer = servingRuntimes.length === 0;

  // const renderPlatformEmptyState = () => (
  //   // if (kServeEnabled || modelMeshEnabled) {
  //   //   return (
  //   //     <EmptyDetailsView
  //   //       allowCreate
  //   //       iconImage={typedEmptyImage(ProjectObjectType.modelServer)}
  //   //       imageAlt={isProjectModelMesh ? 'No model servers' : 'No deployed models'}
  //   //       title={
  //   //         isProjectModelMesh ? 'Start by adding a model server' : 'Start by deploying a model'
  //   //       }
  //   //       description={
  //   //         <Stack hasGutter>
  //   //           {errorSelectingPlatform && (
  //   //             <ModelServingPlatformSelectErrorAlert
  //   //               error={errorSelectingPlatform}
  //   //               clearError={() => setErrorSelectingPlatform(undefined)}
  //   //             />
  //   //           )}
  //   //           <StackItem>
  //   //             {isProjectModelMesh
  //   //               ? 'Model servers are used to deploy models and to allow apps to send requests to your models. Configuring a model server includes specifying the number of replicas being deployed, the server size, the token authentication, the serving runtime, and how the project that the model server belongs to is accessed.\n'
  //   //               : 'Each model is deployed on its own model server.'}
  //   //           </StackItem>
  //   //         </Stack>
  //   //       }
  //   //       createButton={
  //   //         <ModelServingPlatformButtonAction
  //   //           isProjectModelMesh={isProjectModelMesh}
  //   //           testId={`${isProjectModelMesh ? 'add-server' : 'deploy'}-button`}
  //   //           emptyTemplates={emptyTemplates}
  //   //           variant="primary"
  //   //           onClick={() => {
  //   //             setPlatformSelected(
  //   //               isProjectModelMesh ? ServingRuntimePlatform.MULTI : ServingRuntimePlatform.SINGLE,
  //   //             );
  //   //           }}
  //   //         />
  //   //       }
  //   //       footerExtraChildren={
  //   //         deployingFromRegistry &&
  //   //         !isProjectModelMesh && ( // For modelmesh we don't want to offer this until there is a model server
  //   //           <EmptyStateActions>
  //   //             <Button
  //   //               variant="link"
  //   //               onClick={() =>
  //   //                 navigate(modelVersionUrl(modelVersionId, registeredModelId, modelRegistryName))
  //   //               }
  //   //               data-testid="deploy-from-registry"
  //   //             >
  //   //               Deploy model from model registry
  //   //             </Button>
  //   //           </EmptyStateActions>
  //   //         )
  //   //       }
  //   //     />
  //   //   );
  //   // }
  //   //
  //   <EmptyModelServingPlatform />
  // );
  const renderSelectedPlatformModal = () => <></>;

  return (
    <>
      <DetailsSection
        objectType={!emptyModelServer ? objectType : undefined}
        id={id}
        title={!emptyModelServer ? title : undefined}
        actions={shouldShowPlatformSelection || emptyModelServer ? undefined : [<>Foobar</>]}
        description={
          shouldShowPlatformSelection && emptyModelServer
            ? 'Select the model serving type to be used when deploying models from this project.'
            : undefined
        }
        popover={
          !emptyModelServer ? (
            <Popover
              headerContent="About models"
              bodyContent="Deploy models to test them and integrate them into applications. Deploying a model makes it accessible via an API, enabling you to return predictions based on data inputs."
            >
              <DashboardPopupIconButton
                icon={<OutlinedQuestionCircleIcon />}
                aria-label="More info"
              />
            </Popover>
          ) : null
        }
        isLoading={!servingRuntimesLoaded && !templatesLoaded}
        isEmpty={shouldShowPlatformSelection}
        loadError={servingRuntimeError || templateError}
        emptyState={
          SelectServingCards.length > 1 ? (
            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapLg' }}>
              <FlexItem
                flex={{ default: 'flex_1' }}
                style={{ borderRight: '1px solid var(--pf-t--global--border--color--default)' }}
              >
                <EmptyDetailsView
                  iconImage={typedEmptyImage(ProjectObjectType.modelServer)}
                  imageAlt="add a model server"
                />
              </FlexItem>
              <FlexItem flex={{ default: 'flex_1' }}>
                <Stack hasGutter>
                  <StackItem>
                    <Content>
                      <Content component="p">
                        Select the model serving type to be used when deploying from this project.
                      </Content>
                    </Content>
                  </StackItem>
                  <StackItem>
                    <Gallery hasGutter>
                      {SelectServingCards.map((ServingCard, idx) => (
                        <GalleryItem key={idx}>
                          <ServingCard
                            resetButton={
                              <ModelServingPlatformSelectButton
                                namespace={project.metadata.name}
                                servingPlatform={NamespaceApplicationCase.KSERVE_PROMOTION}
                                setError={setErrorSelectingPlatform}
                                variant="secondary"
                                data-testid="single-serving-select-button"
                              />
                            }
                          />
                        </GalleryItem>
                      ))}
                    </Gallery>
                  </StackItem>
                  {errorSelectingPlatform && (
                    <StackItem>
                      <ModelServingPlatformSelectErrorAlert
                        error={errorSelectingPlatform}
                        clearError={() => setErrorSelectingPlatform(undefined)}
                      />
                    </StackItem>
                  )}
                  <StackItem>
                    <Alert
                      variant="info"
                      isInline
                      isPlain
                      title="You can change the model serving type before the first model is deployed from this project. After deployment, switching types requires deleting all models and servers."
                    />
                  </StackItem>
                </Stack>
              </FlexItem>
            </Flex>
          ) : (
            <EmptyModelServingPlatform />
          )
        }
        labels={
          ServingPlatformLabel
            ? [
                <Flex gap={{ default: 'gapSm' }} key="serving-platform-label">
                  <ServingPlatformLabel />

                  {emptyModelServer && availableServingPlatforms.length > 1 && (
                    <ModelServingPlatformSelectButton
                      namespace={project.metadata.name}
                      servingPlatform={NamespaceApplicationCase.RESET_MODEL_SERVING_PLATFORM}
                      setError={setErrorSelectingPlatform}
                      variant="link"
                      isInline
                      data-testid="change-serving-platform-button"
                    />
                  )}
                </Flex>,
              ]
            : undefined
        }
      >
        {/*
        {emptyModelServer ? (
          renderPlatformEmptyState()
        ) : isProjectModelMesh ? (
          <ModelMeshServingRuntimeTable />
        ) : (
          <KServeInferenceServiceTable />
        )}
        */}
        Content goes here
      </DetailsSection>
      {renderSelectedPlatformModal()}
    </>
  );
};

export default ModelServingProjectTab;
