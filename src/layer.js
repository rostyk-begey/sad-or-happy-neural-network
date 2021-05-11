import Neuron from './neuron';

export default class Layer {
  constructor(neuronsCount, previousLayer, network) {
    Object.defineProperty(this, '_network', {
      enumerable: false,
      value: network,
    });
    this.id = previousLayer ? previousLayer.id + 1 : 0;
    this.neurons = [];
    for (let i = 0; i < neuronsCount; i++) {
      this.neurons.push(new Neuron(this, previousLayer, `${this.id}:${i}`));
    }
  }

  get $isFirstLayer() {
    return this.neurons[0].$isFirstLayerNeuron;
  }

  set input(val) {
    if (!this.$isFirstLayer) {
      return;
    }

    if (!Array.isArray(val)) {
      return;
    }

    if (val.length !== this.neurons.length) {
      return;
    }

    val.forEach((v, i) => this.neurons[i].input = v);
  }
}
