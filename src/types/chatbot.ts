/**
 * Types and interfaces for the eGain chatbot decision tree system
 */

/**
 * Represents a single message in the chat conversation
 */
export type ChatMessage = {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: ChatOption[];
  isInputPrompt?: boolean;
  inputType?: 'number';
  validationError?: string;
};

/**
 * Represents a clickable option in the chat interface
 */
export type ChatOption = {
  id: string;
  text: string;
  nextStep: string;
  action?: () => void;
};

/**
 * Represents a step in the decision tree flow
 */
export type ChatStep = {
  id: string;
  message: string;
  options: ChatOption[];
  isEndStep?: boolean;
  isInputPrompt?: boolean;
  inputType?: 'number';
};

/**
 * Represents the current state of the chatbot conversation
 */
export type ChatState = {
  currentStep: string;
  messages: ChatMessage[];
  isActive: boolean;
  conversationPath: string[];
  isWaitingForInput?: boolean;
  inputValidation?: {
    type: 'number';
    min?: number;
    max?: number;
  };
};

/**
 * Decision tree configuration for the eGain chatbot
 */
export type ChatbotConfig = {
  steps: Record<string, ChatStep>;
  initialStep: string;
};

/**
 * Available conversation paths in the decision tree
 */
export type ConversationPath =
  | 'welcome'
  | 'ai-agent'
  | 'ai-knowledge-hub'
  | 'neither'
  | 'exit';

/**
 * Available product options for user selection
 */
export type ProductOption = 'ai-agent' | 'ai-knowledge-hub' | 'neither';
