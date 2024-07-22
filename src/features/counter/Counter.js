import { useSelector, useDispatch } from "react-redux"
import { increment, decrement, reset, incrementByAmount } from "./counterSlice"
import { useState } from "react";

const Counter = () => {
    const count = useSelector((state) => state.counter.count);
    const dispatch = useDispatch();

    const [incrementAmt, setIncrementAmt] = useState(0)

    const addValue = Number(incrementAmt) || 0;

    const resetAll = () => {
        setIncrementAmt(0);
        dispatch(reset());
    };

    return (
        <section>
            <p>{count}</p>
            <button onClick={() => dispatch(increment())}>+</button>
            <button onClick={() => dispatch(decrement())}>-</button>
            <input type="text" value={incrementAmt} onChange={(e) => setIncrementAmt(e.target.value)} />
            <div>
                <button onClick={() => dispatch(incrementByAmount(addValue))}>Add Amount</button>
                <button onClick={resetAll}>Reset</button>
            </div>

        </section>
    )
}

export default Counter