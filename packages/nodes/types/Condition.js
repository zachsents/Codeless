import { elementWise } from "../arrayUtilities.js"


export class Condition {

    constructor(executionSignal) {
        this.executionSignal = executionSignal
    }

    put(item) {
        if (!this.subject)
            this.subject = item
        else
            this.object = item
    }

    setPredicate(predicate) {
        this.predicate = predicate
    }

    setElementWisePredicate(operation) {
        this.predicate = (sub, obj) => elementWise(sub, obj, operation)
    }

    evaluate() {
        // check if we have a stored result we can use
        if(this.lastEvaluation?.hasntChanged())
            return this.lastEvaluation.result
        
        // see if we have a subject and predicate
        if (this.subject != null && this.object != null) {
            // evaluate
            const result = this.predicate?.(this.subject, this.object)

            // store this evaluation
            this.lastEvaluation = new Evaluation(this, result)

            // return result
            return result
        }
    }
}

class Evaluation {
    constructor(condition, result) {
        this.condition = condition
        this.subject = condition.subject
        this.predicate = condition.predicate
        this.object = condition.object
        this.result = result
    }

    /**
     * Determines if the condition has changed since this evaluation was created.
     *
     * @param {Condition} condition
     * @return {boolean} 
     * @memberof Evaluation
     */
    hasntChanged() {
        return this.subject == this.condition.subject &&
            this.predicate == this.condition.predicate &&
            this.object == this.condition.object &&
            this.result == this.condition.lastEvaluation.result
    }
}
