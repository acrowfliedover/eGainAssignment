'use client';

import type { ChatMessage, ChatOption, ChatState } from '@/types/chatbot';
import { chatbotConfig, getStepById } from '@/config/chatbot';
import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Main Chatbot component that handles the conversation flow
 * and renders the chat interface with decision tree navigation
 */
export default function Chatbot(): React.JSX.Element {
  const [chatState, setChatState] = useState<ChatState>({
    currentStep: chatbotConfig.initialStep,
    messages: [],
    isActive: true,
    conversationPath: [],
    isWaitingForInput: false,
    inputValidation: undefined,
  });
  const [userInput, setUserInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Generates a unique ID for messages
   */
  const generateMessageId = useCallback((): string => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Adds a new message to the chat
   */
  const addMessage = useCallback((content: string, type: 'bot' | 'user', options?: ChatOption[], isInputPrompt?: boolean, inputType?: 'number'): void => {
    const newMessage: ChatMessage = {
      id: generateMessageId(),
      type,
      content,
      timestamp: new Date(),
      options,
      isInputPrompt,
      inputType,
    };

    setChatState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, newMessage],
    }));
  }, [generateMessageId]);

  /**
   * Scrolls to the bottom of the chat
   */
  const scrollToBottom = useCallback((): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /**
   * Restarts the conversation
   */
  const restartConversation = useCallback((): void => {
    const initialStep = getStepById(chatbotConfig.initialStep);
    if (initialStep) {
      setChatState({
        currentStep: chatbotConfig.initialStep,
        messages: [],
        isActive: true,
        conversationPath: [],
        isWaitingForInput: false,
        inputValidation: undefined,
      });

      // Add initial welcome message
      addMessage(initialStep.message, 'bot', initialStep.options);

      // Auto-scroll to bottom after adding initial message
      setTimeout(scrollToBottom, 100);
    }
    setUserInput('');
  }, [addMessage, scrollToBottom]);

  /**
   * Handles option selection and navigation
   */
  const handleOptionSelect = useCallback((option: ChatOption): void => {
    // Check if this is a restart/return action
    if (option.id === 'restart' && option.nextStep === 'welcome') {
      // Clear chat and restart conversation
      restartConversation();
      return;
    }

    // Add user's selection as a message
    addMessage(option.text, 'user');

    // Update conversation path
    setChatState(prevState => ({
      ...prevState,
      conversationPath: [...prevState.conversationPath, option.id],
    }));

    // Navigate to next step
    const nextStep = getStepById(option.nextStep);
    if (nextStep) {
      setChatState(prevState => ({
        ...prevState,
        currentStep: option.nextStep,
        isWaitingForInput: nextStep.isInputPrompt || false,
        inputValidation: nextStep.isInputPrompt ? { type: nextStep.inputType || 'number' } : undefined,
      }));

      // Add bot's response
      addMessage(nextStep.message, 'bot', nextStep.options, nextStep.isInputPrompt, nextStep.inputType);

      // Auto-scroll to bottom after adding message
      setTimeout(scrollToBottom, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addMessage, scrollToBottom]);

  /**
   * Validates user input
   */
  const validateInput = useCallback((input: string): boolean => {
    if (chatState.inputValidation?.type === 'number') {
      // Check if input contains a decimal point
      if (input.includes('.')) {
        return false;
      }
      const num = Number.parseInt(input, 10);
      return !Number.isNaN(num) && num > 0;
    }
    return true;
  }, [chatState.inputValidation]);

  /**
   * Calculates cost based on input and pricing type
   */
  const calculateCost = useCallback((input: number, pricingType: 'resolution' | 'session' | 'contact-center' | 'enterprise'): { totalCost: number } => {
    if (pricingType === 'resolution') {
      const totalCost = Math.floor((input + 99) / 100) * 50;
      return { totalCost };
    } else if (pricingType === 'session') {
      const totalCost = Math.floor((input + 999) / 1000) * 200;
      return { totalCost };
    } else if (pricingType === 'contact-center') {
      const totalCost = input * 25;
      return { totalCost };
    } else if (pricingType === 'enterprise') {
      const totalCost = input * 12.50;
      return { totalCost };
    }
    return { totalCost: 0 };
  }, []);

  /**
   * Handles user input submission
   */
  const handleInputSubmit = useCallback((): void => {
    if (!userInput.trim()) {
      return;
    }

    if (!validateInput(userInput)) {
      const errorMessage = userInput.includes('.')
        ? 'Please enter a whole number (no decimals).'
        : 'Please enter a valid number greater than 0.';
      addMessage(errorMessage, 'bot', undefined, true, 'number');

      // Auto-scroll to bottom after adding error message
      setTimeout(scrollToBottom, 100);
      return;
    }

    const inputNumber = Number.parseInt(userInput, 10);
    addMessage(userInput, 'user');

    // Determine pricing type based on current step
    let pricingType: 'resolution' | 'session' | 'contact-center' | 'enterprise';
    let costStep: string;

    if (chatState.currentStep === 'ai-agent-resolution-input') {
      pricingType = 'resolution';
      costStep = 'resolution-cost-calculation';
    } else if (chatState.currentStep === 'ai-agent-session-input') {
      pricingType = 'session';
      costStep = 'session-cost-calculation';
    } else if (chatState.currentStep === 'knowledge-hub-contact-center-input') {
      pricingType = 'contact-center';
      costStep = 'contact-center-cost-calculation';
    } else if (chatState.currentStep === 'knowledge-hub-enterprise-input') {
      pricingType = 'enterprise';
      costStep = 'enterprise-cost-calculation';
    } else {
      return;
    }

    const costResult = calculateCost(inputNumber, pricingType);
    const costMessage = getStepById(costStep);

    if (costMessage) {
      const messageContent = costMessage.message
        .replace(/\{userInput\}/g, inputNumber.toString())
        .replace(/\{totalCost\}/g, costResult.totalCost.toString());

      addMessage(messageContent, 'bot', costMessage.options);

      setChatState(prevState => ({
        ...prevState,
        currentStep: costStep,
        isWaitingForInput: false,
        inputValidation: undefined,
      }));

      // Auto-scroll to bottom after adding message
      setTimeout(scrollToBottom, 100);
    }

    setUserInput('');
  }, [userInput, validateInput, addMessage, chatState.currentStep, calculateCost, scrollToBottom]);

  /**
   * Handles input change
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserInput(e.target.value);
  }, []);

  /**
   * Initialize the conversation on component mount
   */
  useEffect(() => {
    if (chatState.messages.length === 0) {
      const initialStep = getStepById(chatbotConfig.initialStep);
      if (initialStep) {
        addMessage(initialStep.message, 'bot', initialStep.options);

        // Auto-scroll to bottom after adding initial message
        setTimeout(scrollToBottom, 100);
      }
    }
  }, [addMessage, chatState.messages.length, scrollToBottom]);

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col rounded-lg bg-white shadow-lg">
      {/* Chat Header */}
      <div className="rounded-t-lg bg-blue-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">eGain Assistant</h2>
          <button
            onClick={restartConversation}
            className="rounded bg-blue-700 px-3 py-1 text-sm transition-colors hover:bg-blue-800"
            type="button"
            title="Restart conversation"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-h-[80vh] flex-1 space-y-4 overflow-y-auto p-4">
        {chatState.messages.map((message, index) => {
          const isLatestBotMessage = message.type === 'bot' && index === chatState.messages.length - 1;
          const isClickable = isLatestBotMessage && !chatState.isWaitingForInput;

          return (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-line text-sm">
                  {message.content}
                </div>
                {message.options && message.options.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.options.map(option => (
                      <button
                        key={option.id}
                        onClick={isClickable ? () => handleOptionSelect(option) : undefined}
                        disabled={!isClickable}
                        className={`block w-full rounded border px-3 py-2 text-left text-sm transition-colors ${
                          isClickable
                            ? 'cursor-pointer border-gray-300 bg-white hover:bg-gray-50'
                            : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                        }`}
                        type="button"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      {chatState.isWaitingForInput && (
        <div className="border-t bg-gray-50 p-4">
          <div className="flex gap-2">
            <input
              type="number"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Enter a number..."
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleInputSubmit();
                }
              }}
            />
            <button
              onClick={handleInputSubmit}
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              type="button"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Chat Footer */}
      <div className="rounded-b-lg border-t bg-gray-50 p-4">
        <div className="text-center text-xs text-gray-500">
          {chatState.isWaitingForInput
            ? 'Enter a number above to get your cost estimate'
            : 'Powered by eGain AI • Click options above to continue the conversation'}
        </div>
      </div>
    </div>
  );
}
