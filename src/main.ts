import './style.css';
// @ts-ignore: No types yet available
import { createApp } from 'petite-vue';

createApp({
  input: {
    field1: null,
    field2: null,
  },
  emailInput: null,
  emailOutput: null,
  output: null,
  duplicates: 0,
  showDuplicates: false,
  selectedJoinChar: ';',
  ignoreDuplicates: false,
  onlyFirst: false,
  total: 0,

  removeDuplicates() {
    if (!this.input.field1 && !this.input.field2) {
      return;
    }

    this.output = null;
    this.total = 0;

    let wordsField1 = this.input.field1
      ?.replaceAll(/(\r\n|\n|\r|-\n)/gm, ' ')
      ?.trim()
      ?.replaceAll(';', ' ')
      ?.split(' ');

    let wordsField2 = this.input.field2
      ?.replaceAll(/(\r\n|\n|\r|-\n)/gm, ' ')
      ?.trim()
      ?.replaceAll(';', ' ')
      ?.split(' ');

    if (!wordsField1) {
      wordsField1 = [];
    }

    if (!wordsField2) {
      wordsField2 = [];
    }

    const hashMap: { [key: string]: boolean } = {};
    let duplicates: string[] = [];

    for (const word of wordsField1) {
      if (hashMap[word]) {
        duplicates.push(word);
      }

      hashMap[word] = true;
    }

    for (const word of wordsField2) {
      if (hashMap[word]) {
        duplicates.push(word);
      }

      hashMap[word] = true;
    }

    let uniqueOutput = [];

    if (this.onlyFirst) {
      for (const word of wordsField1) {
        if (hashMap[word]) {
          uniqueOutput.push(word);
          delete hashMap[word];
        }
      }
    } else {
      uniqueOutput = Object.keys(hashMap);
    }

    if (this.ignoreDuplicates) {
      let out = [];

      for (const s of uniqueOutput) {
        if (!duplicates.includes(s)) {
          out.push(s);
        }
      }

      this.output = out.join(this.selectedJoinChar || ';');
      this.total = out.length;
    } else {
      this.output = uniqueOutput.join(this.selectedJoinChar || ';');
      this.total = uniqueOutput.length;
    }

    this.duplicates = duplicates;
  },

  copy() {
    const textarea = document.querySelector('#output') as HTMLInputElement;
    textarea?.select();
    textarea?.setSelectionRange(0, 99999);
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

  getEmails() {
    const emails = extractEmails(this.emailInput);

    if (!emails) {
      this.emailOutput = null;
      return;
    }

    this.emailOutput = emails;
  },
}).mount();

function extractEmails(text: string) {
  const regex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/gi;
  const matches = text.match(regex);
  return matches ? matches.join(';') : '';
}
