import { useState } from 'react';
import { DICE } from '../Config/constants';



export function useDice(initialDices) {
    const [dices, setDices] = useState({
        d6: { value: initialDices.d6, startValue: initialDices.d6, isUsed: false, isTouched: false, type: DICE.d6 },
        d8: { value: initialDices.d8, startValue: initialDices.d8, isUsed: false, isTouched: false, type: DICE.d8  },
        d10: { value: initialDices.d10, startValue: initialDices.d10, isUsed: false, isTouched: false, type: DICE.d10  },
        d12: { value: initialDices.d12, startValue: initialDices.d12, isUsed: false, isTouched: false, type: DICE.d12  },
    });

    const updateDice = (type, updates) => {
        setDices((prev) => ({
            ...prev,
            [type]: { ...prev[type], ...updates }
        }));
    };

    const resetDices = (newValues) => {
        setDices({
            d6: { value: newValues.d6, startValue: newValues.d6, isUsed: false, isTouched: false, type: DICE.d6  },
            d8: { value: newValues.d8, startValue: newValues.d8, isUsed: false, isTouched: false, type: DICE.d8  },
            d10: { value: newValues.d10, startValue: newValues.d10, isUsed: false, isTouched: false, type: DICE.d10  },
            d12: { value: newValues.d12, startValue: newValues.d12, isUsed: false, isTouched: false, type: DICE.d12  },
        });
    };

    const resetUsedDices = () => {
        setDices((prev) => ({
            d6: { ...prev.d6, isUsed: false },
            d8: { ...prev.d8, isUsed: false },
            d10: { ...prev.d10, isUsed: false },
            d12: { ...prev.d12, isUsed: false },
        }));
    };

    const resetTouchedDices = () => {
        setDices((prev) => ({
            d6: { ...prev.d6, isTouched: false },
            d8: { ...prev.d8, isTouched: false },
            d10: { ...prev.d10, isTouched: false },
            d12: { ...prev.d12, isTouched: false },
        }));
    };

    return {
        d6: { ...dices.d6, setValue: (val) => updateDice(DICE.d6, { value: val }), setIsUsed: (val) => updateDice(DICE.d6, { isUsed: val }), setIsTouched: (val) => updateDice(DICE.d6, { isTouched: val }) },
        d8: { ...dices.d8, setValue: (val) => updateDice(DICE.d8, { value: val }), setIsUsed: (val) => updateDice(DICE.d8, { isUsed: val }), setIsTouched: (val) => updateDice(DICE.d8, { isTouched: val }) },
        d10: { ...dices.d10, setValue: (val) => updateDice(DICE.d10, { value: val }), setIsUsed: (val) => updateDice(DICE.d10, { isUsed: val }), setIsTouched: (val) => updateDice(DICE.d10, { isTouched: val }) },
        d12: { ...dices.d12, setValue: (val) => updateDice(DICE.d12, { value: val }), setIsUsed: (val) => updateDice(DICE.d12, { isUsed: val }), setIsTouched: (val) => updateDice(DICE.d12, { isTouched: val }) },
        resetDices,
        resetUsedDices,
        resetTouchedDices
    };
}
