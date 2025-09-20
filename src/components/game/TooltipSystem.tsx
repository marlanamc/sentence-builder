'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface GrammarTooltipProps {
  content: string;
  children: React.ReactNode;
}

export const GrammarTooltip: React.FC<GrammarTooltipProps> = ({ content, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface CategoryHelpButtonProps {
  category: string;
}

export const CategoryHelpButton: React.FC<CategoryHelpButtonProps> = ({ category }) => {
  const getCategoryHelp = (category: string) => {
    const helpTexts: Record<string, string> = {
      'subjects': 'Subjects are the people, places, or things that perform the action in a sentence.',
      'verbs': 'Verbs are action words that show what the subject does.',
      'objects': 'Objects receive the action of the verb in a sentence.',
      'articles': 'Articles (a, an, the) help specify which noun you\'re talking about.',
      'helpers': 'Helper verbs (do, does, did, am, is, are) help form questions and negatives.',
      'negatives': 'Negative words (not, don\'t, doesn\'t) make sentences negative.',
      'question-words': 'Question words (what, who, where) help ask questions.',
      'time-expressions': 'Time expressions tell us when something happens.'
    };
    return helpTexts[category] || 'Click on words to add them to your sentence.';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{getCategoryHelp(category)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface WordButtonWithTooltipProps {
  word: string;
  category: string;
  tooltip?: string;
  onClick: () => void;
  className?: string;
  toggleable?: boolean;
}

export const WordButtonWithTooltip: React.FC<WordButtonWithTooltipProps> = ({
  word,
  category,
  tooltip,
  onClick,
  className,
  toggleable
}) => {
  const getDefaultTooltip = (word: string, category: string) => {
    if (tooltip) return tooltip;
    
    const tooltips: Record<string, string> = {
      'pronoun': 'A pronoun replaces a noun (I, you, he, she, it, we, they)',
      'verb': 'A verb shows action or state of being',
      'countable-noun': 'A countable noun can be counted (one book, two books)',
      'uncountable-noun': 'An uncountable noun cannot be counted (water, music)',
      'indefinite-article': 'Use "a" before consonant sounds, "an" before vowel sounds',
      'definite-article': 'Use "the" when referring to something specific',
      'auxiliary': 'Helper verb used with main verbs',
      'be-verb': 'Forms of "be" (am, is, are, was, were)',
      'negation': 'Makes a sentence negative',
      'wh-question': 'Question word that asks for specific information'
    };
    
    return tooltips[category] || `Click to add "${word}" to your sentence`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={onClick}
            className={className}
          >
            {word}
            {toggleable && <span className="ml-1 text-xs">↕</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{getDefaultTooltip(word, category)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
