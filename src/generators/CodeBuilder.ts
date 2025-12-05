/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export class CodeBuilder {
    tabLevel = 0;
    code = '';

    tab() {
        this.tabLevel++;
    }

    unTab() {
        this.tabLevel--;
    }

    inTab(callback: () => void) {
        this.tab();
        callback();
        this.unTab();
    }

    add(text?: string, moveLine = true) {
        if (!text) {
            this.code += '\n';
            return;
        }

        let tab = ' '.repeat(this.tabLevel * 4);
        this.code += tab + text + (moveLine ? '\n' : '');
    }

    addMultiline(text: string, inline = false) {
        let lines = text.split('\n');
        let i = 0;
        let endsWithNewline = text.endsWith('\n');
        for (let line of lines) {
            if (line === '\n' && lines.indexOf(line) === lines.length - 1) {
                continue;
            }
            if (inline && i === 0) {
                this.code += line;
                // Only add newline if this is not the last line or if text doesn't end with newline
                if (i < lines.length - 1 || !endsWithNewline) {
                    this.code += '\n';
                }
            } else {
                // For the last line, don't add newline if text already ends with newline
                if (i === lines.length - 1 && endsWithNewline && line === '') {
                    // Skip empty last line that was created by split('\n')
                    continue;
                }
                this.add(line);
            }
            i++;
        }
    }

    append(code: CodeBuilder) {
        this.addMultiline(code.render());
    }

    appendInline(code: CodeBuilder) {
        this.addMultiline(code.render(), true);
    }

    render() {
        return this.code;
    }
}
