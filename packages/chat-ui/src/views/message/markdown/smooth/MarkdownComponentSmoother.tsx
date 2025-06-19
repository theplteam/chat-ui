import * as React from 'react';
import MarkdownTexts from '../MessageMarkdownTexts';
import clsx from 'clsx';
import { chatClassNames } from '../../../core/chatClassNames';

type Props = React.PropsWithChildren<{
  inProgress: boolean;
  component: React.JSXElementConstructor<any>;
  componentProps: any;
}>;

const MarkdownComponentSmoother: React.FC<Props> = ({ inProgress, children, component, componentProps }) => {

  return (
    <MarkdownTexts
      component={component}
      inProgress={inProgress}
      componentProps={{
        ...componentProps,
        className: clsx(componentProps?.className, {
          [chatClassNames.markdownSmoothedPending]: inProgress,
        })
      }}
    >
      {children}
    </MarkdownTexts>
  );
}

export default MarkdownComponentSmoother;
