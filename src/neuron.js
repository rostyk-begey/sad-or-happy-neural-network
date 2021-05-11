import Input from './input';

export default class Neuron {
  constructor(layer, previousLayer, id) {
    Object.defineProperty(this, '_layer', {
      enumerable: false,
      value: layer,
    });

    this.id = id;

    this.inputs = previousLayer
      ? previousLayer.neurons.map((neuron) => new Input(neuron, Math.random() - 0.5, `${neuron.id.split(':')[1]}:${this.id}`))
      : [0];
  }

  get inputSum() {
    return this.inputs.reduce((sum, input) => {
      return sum + input.neuron.value * input.weight;
    }, 0);
  }

  get $isFirstLayerNeuron() {
    return !(this.inputs[0] instanceof Input)
  }

  get value() {
    return this.$isFirstLayerNeuron
      ? this.inputs[0]
      : this._layer._network.activationFunction(this.inputSum);
  }

  set input(val) {
    if (!this.$isFirstLayerNeuron) {
      return;
    }

    this.inputs[0] = val;
  }

  set error(error) {
    if (this.$isFirstLayerNeuron) {
      return;
    }

    const wDelta = error * this._layer._network.derivativeFunction(this.inputSum);

    this.inputs.forEach((input) => {
      input.weight -= input.neuron.value * wDelta * this._layer._network.learningRate;
      input.neuron.error = input.weight * wDelta;
    });
  }
}
