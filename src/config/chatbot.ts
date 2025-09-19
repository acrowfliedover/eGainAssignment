/**
 * eGain Chatbot Decision Tree Configuration
 * Defines the conversation flow and available options
 */

import type { ChatbotConfig, ChatStep } from '@/types/chatbot';

/**
 * Configuration for the eGain chatbot decision tree
 */
export const chatbotConfig: ChatbotConfig = {
  initialStep: 'welcome',
  steps: {
    'welcome': {
      id: 'welcome',
      message: 'Welcome to eGain, we can help your company process and store instructional documents and build employee and customer facing AI agents. Here are the list of products we have:\n\nAI Agent: provides trusted answers using your documents, websites, and knowledge base. It helps resolve customer queries, reduces handle time, and decreases agent onboarding time.\n\nAI Knowledge Hub: serves as the central nervous system for enterprise knowledge. It connects disparate content repositories, from SharePoint and Confluence to websites and CRM knowledge bases, creating a single source of truth. It facilitates an intelligent collaboration between AI systems and subject matter experts to create accurate, contextual knowledge articles, curate content to ensure relevance and compliance and organize information for optimal discovery and application.\n\nWhich one of these do you want to look into?',
      options: [
        {
          id: 'ai-agent',
          text: 'AI Agent',
          nextStep: 'ai-agent-pricing',
        },
        {
          id: 'ai-knowledge-hub',
          text: 'AI Knowledge Hub',
          nextStep: 'knowledge-hub-pricing',
        },
        {
          id: 'neither',
          text: 'Neither',
          nextStep: 'exit',
        },
      ],
    },
    'ai-agent-pricing': {
      id: 'ai-agent-pricing',
      message: 'We have two pricings for AI Agent:\n\n1. $0.50 per Resolution, sold in blocks of 100 ($50 per block). A Resolution is defined as a conversation with a customer followed by 24 hours of silence.\n\n2. $0.20 per self-service session, bought in blocks of 1000 billable session units for intelligent self-service for customers. A customer self-service session is initiated when a customer accesses the eGain self-service portal or API. The session ends when the user exits the session or remains inactive beyond the inactivity timeout period of 20 minutes. Billing is based on 10-minute increments, rounded up.\n\nWhich one of these are you interested in?',
      options: [
        {
          id: 'option-1',
          text: 'Option 1',
          nextStep: 'ai-agent-resolution-input',
        },
        {
          id: 'option-2',
          text: 'Option 2',
          nextStep: 'ai-agent-session-input',
        },
        {
          id: 'neither-pricing',
          text: 'Neither',
          nextStep: 'exit',
        },
      ],
    },
    'ai-agent-resolution-input': {
      id: 'ai-agent-resolution-input',
      message: 'Please enter a number of resolutions you will have per month so I can provide an estimated cost.',
      options: [],
      isInputPrompt: true,
      inputType: 'number',
    },
    'ai-agent-session-input': {
      id: 'ai-agent-session-input',
      message: 'Please enter a number of self-service sessions you will have per month so I can provide an estimated cost. Note that sessions lasting longer than 10 minutes will count as 2, 20+ minutes 3 and so on.',
      options: [],
      isInputPrompt: true,
      inputType: 'number',
    },
    'resolution-cost-calculation': {
      id: 'resolution-cost-calculation',
      message: `Thank you for providing your resolution count. Here's your estimated monthly cost:\n\nYour Input: {userInput} resolutions per month\n\nTotal Monthly Cost: \${totalCost}\n\nThis estimate is based on our Resolution-Based Pricing model.`,
      options: [
        {
          id: 'restart',
          text: 'Return',
          nextStep: 'welcome',
        },
      ],
      isEndStep: true,
    },
    'session-cost-calculation': {
      id: 'session-cost-calculation',
      message: `Thank you for providing your session count. Here's your estimated monthly cost:\n\nYour Input: {userInput} sessions per month\n\nTotal Monthly Cost: \${totalCost}\n\nThis estimate is based on our Self-Service Session Pricing model.`,
      options: [
        {
          id: 'restart',
          text: 'Return',
          nextStep: 'welcome',
        },
      ],
      isEndStep: true,
    },
    'knowledge-hub-pricing': {
      id: 'knowledge-hub-pricing',
      message: 'We have two types of users that can use the knowledge hub.\n\nContact Center User: $25 per named user per month for AI-powered knowledge and guidance for contact center agents. A contact center user is anyone who works in a contact center or customer service group and needs to access the system, including agents, supervisors, managers, analysts, and knowledge management staff.\n\nEnterprise User: $12.50 per named user per month for AI-powered knowledge and guidance for enterprise users (outside the contact center). An enterprise user is any employee or consultant who does not work in the contact center of a customer service group. A named user is a uniquely identified individual authorized to access eGain AI Knowledge Hub.\n\nWhich one of these are you interested in?',
      options: [
        {
          id: 'contact-center-user',
          text: 'Contact Center User',
          nextStep: 'knowledge-hub-contact-center-input',
        },
        {
          id: 'enterprise-user',
          text: 'Enterprise User',
          nextStep: 'knowledge-hub-enterprise-input',
        },
        {
          id: 'neither-user-type',
          text: 'Neither',
          nextStep: 'exit',
        },
      ],
    },
    'knowledge-hub-contact-center-input': {
      id: 'knowledge-hub-contact-center-input',
      message: 'Please enter a number of Contact Center Users you have so I can provide an estimated cost per month.',
      options: [],
      isInputPrompt: true,
      inputType: 'number',
    },
    'knowledge-hub-enterprise-input': {
      id: 'knowledge-hub-enterprise-input',
      message: 'Please enter a number of Enterprise Users you have so I can provide an estimated cost per month.',
      options: [],
      isInputPrompt: true,
      inputType: 'number',
    },
    'contact-center-cost-calculation': {
      id: 'contact-center-cost-calculation',
      message: `Thank you for providing your Contact Center User count. Here's your estimated monthly cost:\n\nYour Input: {userInput} Contact Center Users\n\nTotal Monthly Cost: \${totalCost}\n\nThis estimate is based on our Contact Center User pricing model.`,
      options: [
        {
          id: 'restart',
          text: 'Return',
          nextStep: 'welcome',
        },
      ],
      isEndStep: true,
    },
    'enterprise-cost-calculation': {
      id: 'enterprise-cost-calculation',
      message: `Thank you for providing your Enterprise User count. Here's your estimated monthly cost:\n\nYour Input: {userInput} Enterprise Users\n\nTotal Monthly Cost: \${totalCost}\n\nThis estimate is based on our Enterprise User pricing model.`,
      options: [
        {
          id: 'restart',
          text: 'Return',
          nextStep: 'welcome',
        },
      ],
      isEndStep: true,
    },
    'exit': {
      id: 'exit',
      message: 'Thank you for using eGain. We are looking forward to further discussion on the services.',
      options: [
        {
          id: 'restart',
          text: 'Return',
          nextStep: 'welcome',
        },
      ],
      isEndStep: true,
    },
  },
};

/**
 * Helper function to get a step by ID
 */
export function getStepById(stepId: string): ChatStep | undefined {
  return chatbotConfig.steps[stepId];
}

/**
 * Helper function to get the initial step
 */
export function getInitialStep(): ChatStep {
  const step = chatbotConfig.steps[chatbotConfig.initialStep];
  if (!step) {
    throw new Error(`Initial step '${chatbotConfig.initialStep}' not found`);
  }
  return step;
}
