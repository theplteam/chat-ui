import * as React from 'react';
import MarkdownToJsx from 'markdown-to-jsx';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { useChatContext } from '../../core/ChatGlobalContext';
import MarkdownParagraphParser from './MessageMarkdownParagraphParser';
import { useSmoothManager } from './smooth/useSmoothManager';
import MarkdownComponentSmoother from './smooth/MarkdownComponentSmoother';
import { AccentComponent, BoldComponent, ItalicComponent, LiComponent, StrongComponent } from './SimpleMarkdownComponents';
import MarkdownLazyComponentSmoother from './smooth/MarkdownLazyComponentSmoother';
import { SlotPropsType } from '../../core/SlotPropsType';
import { Message, Thread } from '../../../models';
import clsx from 'clsx';
import { chatClassNames } from '../../core/chatClassNames';
import { useInProgressStateCache } from './useInProgressStateCache';

type Props = {
  text: string;
  inProgress: boolean;
};

const MessageMarkdown: React.FC<Props> = ({ text, inProgress: inProgressProp }) => {
  const { slots, slotProps } = useChatSlots();
  const { processAssistantText } = useChatContext();

  const inProgress = useInProgressStateCache(inProgressProp);

  if (processAssistantText) {
    text = processAssistantText(text);
  }

  const getLazySmoothComponent = React.useCallback((componentKey: keyof SlotPropsType<Message, Thread>) => {
    return ({
      component: slots[componentKey],
      props: {
        ...slotProps[componentKey],

        className: clsx(
          slotProps?.[componentKey]?.className,
          { [chatClassNames.markdownSmoothedPending]: inProgress }
        )
      },
    });
  }, [inProgress]);

  const paragraphSettings = React.useMemo(() => ({
    component: MarkdownParagraphParser,
    props: {
      pSlot: slots.markdownP,
      pSlotProps: slotProps.markdownP,
      inProgress: inProgress,
    }
  }), [inProgress, slots, slotProps]);

  useSmoothManager(text, inProgress);

  return (
    <MarkdownToJsx
      options={{
        forceBlock: true,
        forceWrapper: true,
        wrapper: slots.markdownWrapper,
        overrides: {
          a: {
            component: slots.markdownA,
            props: {
              ...slotProps.markdownA,
              className: clsx(
                slotProps.markdownA?.className,
                { [chatClassNames.markdownSmoothedPending]: inProgress }
              )
            },
          },
          table: getLazySmoothComponent('markdownTable'),
          thead: {
            component: slots.markdownThead,
            props: {
              ...slotProps.markdownThead,
            },
          },
          tbody: {
            component: slots.markdownTbody,
            props: {
              ...slotProps.markdownTbody,
            },
          },
          th: {
            component: slots.markdownTh,
            props: {
              ...slotProps.markdownTh,
              textComponent: slots.markdownTdText,
              textComponentProps: slotProps.markdownTdText,
            },
          },
          td: {
            component: slots.markdownTd,
            props: {
              ...slotProps.markdownTd,
              textComponent: slots.markdownTdText,
              textComponentProps: slotProps.markdownTdText,
            },
          },
          tr: {
            component: slots.markdownTr,
            props: {
              ...slotProps.markdownTr,
            },
          },
          ul: {
            component: slots.markdownUl,
            props: {
              ...slotProps.markdownUl,
            },
          },
          ol: {
            component: slots.markdownOl,
            props: {
              ...slotProps.markdownOl,
            },
          },
          li: {
            // Looks like this is also needed in slots
            component: MarkdownComponentSmoother,
            props: { inProgress, component: LiComponent },
          },
          b: {
            component: MarkdownLazyComponentSmoother,
            props: { inProgress, component: BoldComponent },
          },
          i: {
            component: MarkdownLazyComponentSmoother,
            props: { inProgress, component: ItalicComponent },
          },
          strong: {
            component: MarkdownLazyComponentSmoother,
            props: { inProgress, component: StrongComponent },
          },
          h1: getLazySmoothComponent('markdownH1'),
          h2: getLazySmoothComponent('markdownH2'),
          h3: getLazySmoothComponent('markdownH3'),
          h4: getLazySmoothComponent('markdownH4'),
          h5: getLazySmoothComponent('markdownH5'),
          h6: getLazySmoothComponent('markdownH6'),
          pre: getLazySmoothComponent('markdownCodeWrapper'),
          code: getLazySmoothComponent('markdownCode'),
          hr: getLazySmoothComponent('markdownHr'),
          blockquote: getLazySmoothComponent('markdownBlockquote'),
          img: {
            component: slots.markdownImg,
            props: {
              ...slotProps.markdownImg,
              rootClassName: clsx(
                slotProps.markdownImg?.rootClassName,
                { [chatClassNames.markdownSmoothedPending]: inProgress }
              )
            },
          },
          em: {
            component: MarkdownLazyComponentSmoother,
            props: { inProgress, component: AccentComponent },
          },
          p: paragraphSettings,
          span: paragraphSettings,
        },
      }}
    >
      {text}
    </MarkdownToJsx>
  );
}

export default MessageMarkdown;
