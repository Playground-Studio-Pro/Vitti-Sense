import { useReducer, useEffect } from 'react';
import { Role, Scenario } from '../data/content';

// States
export type AppState =
  | 'S0_IDLE'
  | 'S1_HOOK'
  | 'S1_ENTER_NEURAL'
  | 'S2_WHAT_IS'
  | 'S3_ROLE'
  | 'S4_SCENARIO'
  | 'S5_QUESTION'
  | 'S6_THINKING'
  | 'S7_RESULT'
  | 'S8_QR'
  | 'S9_DONE';

// Actions
export type Action =
  | { type: 'START' }
  | { type: 'GO_HOOK' } // Explicit for back nav
  | { type: 'ENTER_NEURAL_MODE' }
  | { type: 'GO_WHAT_IS' }
  | { type: 'GO_ROLE' }
  | { type: 'SELECT_ROLE'; role: Role }
  | { type: 'SELECT_SCENARIO'; scenario: Scenario }
  | { type: 'SUBMIT_QUESTION' }
  | { type: 'FINISH_THINKING' }
  | { type: 'SHOW_QR' }
  | { type: 'FINISH_DEMO' }
  | { type: 'RESET' }
  | { type: 'BACK' };

interface StateContext {
  currentState: AppState;
  selectedRole: Role | null;
  selectedScenario: Scenario | null;
}

const initialState: StateContext = {
  currentState: 'S0_IDLE',
  selectedRole: null,
  selectedScenario: null,
};

function reducer(state: StateContext, action: Action): StateContext {
  switch (action.type) {
    case 'START':
      return { ...state, currentState: 'S1_HOOK' };

    case 'GO_HOOK':
      return { ...state, currentState: 'S1_HOOK' };

    case 'ENTER_NEURAL_MODE':
      return { ...state, currentState: 'S1_ENTER_NEURAL' };

    case 'GO_WHAT_IS':
      return { ...state, currentState: 'S2_WHAT_IS' };

    case 'GO_ROLE':
      return { ...state, currentState: 'S3_ROLE' };

    case 'SELECT_ROLE':
      return { ...state, selectedRole: action.role, currentState: 'S4_SCENARIO' };

    case 'SELECT_SCENARIO':
      return { ...state, selectedScenario: action.scenario, currentState: 'S5_QUESTION' };

    case 'SUBMIT_QUESTION':
      return { ...state, currentState: 'S6_THINKING' };

    case 'FINISH_THINKING':
      return { ...state, currentState: 'S7_RESULT' };

    case 'SHOW_QR':
      return { ...state, currentState: 'S8_QR' };

    case 'FINISH_DEMO':
      return { ...state, currentState: 'S9_DONE' };

    case 'RESET':
      return initialState;

    case 'BACK':
      // Back logic based on current state
      switch (state.currentState) {
        case 'S1_HOOK': return initialState;
        case 'S1_ENTER_NEURAL': return { ...state, currentState: 'S1_HOOK' };
        case 'S2_WHAT_IS': return { ...state, currentState: 'S1_HOOK' };
        case 'S3_ROLE': return { ...state, currentState: 'S1_HOOK' };
        case 'S4_SCENARIO': return { ...state, currentState: 'S3_ROLE', selectedRole: null };
        case 'S5_QUESTION': return { ...state, currentState: 'S4_SCENARIO', selectedScenario: null };
        case 'S6_THINKING': return { ...state, currentState: 'S4_SCENARIO', selectedScenario: null }; // Abort thinking
        case 'S7_RESULT': return { ...state, currentState: 'S4_SCENARIO', selectedScenario: null };
        case 'S8_QR': return { ...state, currentState: 'S7_RESULT' };
        default: return state;
      }

    default:
      return state;
  }
}

export const useFSM = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};
