import Layer from './layer';

export default class Network {
  static  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  static sigmoidDerivative(x) {
    return Network.sigmoid(x) * (1 - Network.sigmoid(x));
  }

  constructor(inputSize, outputSize, hiddenLayersCount = 1, learningRate = 0.5) {
    this.activationFunction = Network.sigmoid;
    this.derivativeFunction = Network.sigmoidDerivative;
    this.learningRate = learningRate;

    this.layers = [new Layer(inputSize, null, this)];

    for (let i = 0; i < hiddenLayersCount; i++) {
      const layerSize = Math.min(inputSize * 2 - 1, Math.ceil((inputSize * 2 / 3) + outputSize));
      this.layers.push(new Layer(layerSize, this.layers[this.layers.length - 1], this));
    }

    this.layers.push(new Layer(outputSize, this.layers[this.layers.length - 1], this));
  }

  get prediction() {
    return this.layers[this.layers.length - 1].neurons.map((neuron) => neuron.value);
  }

  set input(val) {
    this.layers[0].input = val;
  }

  trainOnce(dataSet) {
    if (!Array.isArray(dataSet)) {
      return;
    }

    dataSet.forEach((dataCase) => {
      const [input, expected] = dataCase;

      this.input = input;
      this.prediction.forEach((r, i) => {
        this.layers[this.layers.length - 1].neurons[i].error = r - expected[i];
      });
    });
  }

  train(dataSet, epochs = 100000) {
    return new Promise(resolve => {
      for (let i = 0; i < epochs; i++) {
        this.trainOnce(dataSet);
      }
      resolve();
    });
  }

  get weights() {
    return JSON.stringify(this.layers.map(l => l.neurons.map(n => n.inputs)).flat(2)
      .filter((input) => input instanceof Input)
      .map(w => [w.id, w.weight]));
  }

  set weights(modelStr) {
    let weights = []

    try {
      weights = JSON.parse(modelStr);
      weights.forEach((w) => {
        const [fromNeuronIndex, layerIndex, toNeuronIndex] = w[0].split(':');
        this.layers[+layerIndex].neurons[+toNeuronIndex].inputs[+fromNeuronIndex].weight = w[1];
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  get model() {
    return [
      this.layers[0].neurons.length,
      this.layers[this.layers.length - 1].neurons.length,
      this.layers.length - 2,
      this.weights,
    ].join('*');
  }

  static fromModel(modelStr) {
    const [inputSize, outputSize, hiddenLayersCount, weights] = modelStr.split('*');
    const network = new Network(+inputSize, +outputSize, +hiddenLayersCount);
    network.weights = weights;
    return network;
  }
}
