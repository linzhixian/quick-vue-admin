exports.checkNeedParams = function (data, needParams) {
    for (let i = 0; i < needParams.length; i++) {
        if (!data[needParams[i]]) {
            throw new Error("no "+needParams[i]);
        }
    }

}