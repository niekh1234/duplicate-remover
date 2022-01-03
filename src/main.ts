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

  removeDuplicates() {
    if (!this.input.field1 && !this.input.field2) {
      return;
    }

    this.output = null;

    let f1 = this.input.field1
      ?.replaceAll(/(\r\n|\n|\r|-\n)/gm, ' ')
      ?.trim()
      ?.replaceAll(';', ' ')
      ?.split(' ');

    let f2 = this.input.field2
      ?.replaceAll(/(\r\n|\n|\r|-\n)/gm, ' ')
      ?.trim()
      ?.replaceAll(';', ' ')
      ?.split(' ');

    if (!f1) {
      f1 = [];
    }

    if (!f2) {
      f2 = [];
    }

    // O(n)?
    const hashMap: Record<string, string> = {};
    const duplicates: string[] = [];

    for (const s of f1) {
      // slightly worse perfomance but better ux, not detrimental of course as object lookups are O(1)
      if (hashMap[s]) {
        duplicates.push(s);
      }

      hashMap[s] = s;
    }

    const output: string[] = Object.values(hashMap);

    for (const s of f2) {
      if (hashMap[s]) {
        duplicates.push(s);
        continue;
      }
      output.push(s);
    }

    // O(n)?
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

    console.log(this.ignoreDuplicates);

    if (this.ignoreDuplicates) {
      let out = [];

      for (const s of uniqueOutput) {
        if (!duplicates.includes(s)) {
          out.push(s);
        }
      }

      this.output = out.join(this.selectedJoinChar || ';');
    } else {
      this.output = uniqueOutput.join(this.selectedJoinChar || ';');
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
