import './style.css';
// @ts-ignore: No types yet available
import { createApp } from 'petite-vue';

createApp({
  input: {
    field1: null,
    field2: null,
  },
  output: null,
  duplicates: 0,
  showDuplicates: false,
  selectedJoinChar: ';',

  removeDuplicates() {
    if (!this.input.field1 && !this.input.field2) {
      return;
    }

    if (this.input.field1 && !this.input.field2) {
      return (this.output = this.input.field1);
    }

    if (!this.input.field1 && this.input.field2) {
      return (this.output = this.input.field2);
    }

    this.output = null;

    const f1 = this.input.field1
      ?.replaceAll(/(\r\n|\n|\r|-\n)/gm, ' ')
      ?.trim()
      ?.replaceAll(';', ' ')
      ?.split(' ');

    const f2 = this.input.field2
      ?.replaceAll(/(\r\n|\n|\r|-\n)/gm, ' ')
      ?.trim()
      ?.replaceAll(';', ' ')
      ?.split(' ');

    // O(n)
    const hashMap: Record<string, string> = {};

    for (const s of f1) {
      hashMap[s] = s;
    }

    const output: string[] = Object.values(hashMap);
    const duplicates: string[] = [];

    for (const s of f2) {
      if (hashMap[s]) {
        duplicates.push(s);
        continue;
      }

      output.push(s);
    }

    // O(n)
    const selfDuplicateHashmap: Record<string, string> = {};
    const uniqueOutput: string[] = [];

    for (const s of output) {
      if (selfDuplicateHashmap[s]) {
        duplicates.push(s);
        continue;
      }

      selfDuplicateHashmap[s] = s;
      uniqueOutput.push(s);
    }

    this.output = uniqueOutput.join(this.selectedJoinChar || ';');
    this.duplicates = duplicates;
  },

  copy() {
    const textarea = document.querySelector('#output') as HTMLInputElement;
    textarea?.select();
    textarea.setSelectionRange(0, 99999);
    document.execCommand('copy');
  },

  clear() {
    this.input = {
      field1: null,
      field2: null,
    };
    this.output = null;
    this.showDuplicates = false;
    this.duplicates = [];
  },
}).mount();
