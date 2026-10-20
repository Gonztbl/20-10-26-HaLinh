import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LETTER_PRESETS,
  getPresetById,
  validateLetterData,
  estimateReadTimeSeconds,
  formatFullLetterText
} from './letterPresets.ts';

test('LETTER_PRESETS includes Ha Linh love letter preset as first preset', () => {
  const defaultPreset = LETTER_PRESETS[0];
  assert.equal(defaultPreset.id, 'ha_linh_love');
  assert.match(defaultPreset.recipient, /Hà Linh/i);
  assert.match(defaultPreset.signOff, /Hà Linh/i);
});

test('getPresetById returns ha_linh_love or requested preset', () => {
  const p = getPresetById('ha_linh_love');
  assert.equal(p.id, 'ha_linh_love');

  const fallback = getPresetById('unknown_preset_123');
  assert.equal(fallback.id, 'ha_linh_love');
});

test('validateLetterData rejects empty data and accepts valid data', () => {
  const invalid = validateLetterData({ recipient: '', title: '', paragraphs: [] });
  assert.equal(invalid.isValid, false);
  assert.equal(invalid.errors.length, 3);

  const valid = validateLetterData({
    recipient: 'Gửi Hà Linh',
    title: 'Yêu Em',
    paragraphs: ['Nội dung yêu thương']
  });
  assert.equal(valid.isValid, true);
  assert.equal(valid.errors.length, 0);
});

test('estimateReadTimeSeconds provides sensible reading duration', () => {
  const shortText = ['Một hai ba bốn năm'];
  assert.equal(estimateReadTimeSeconds(shortText), 10);
});

test('formatFullLetterText concatenates recipient, body, signOff, and date', () => {
  const sample = LETTER_PRESETS[0];
  const formatted = formatFullLetterText(sample);
  assert.ok(formatted.includes('Hà Linh'));
  assert.ok(formatted.includes(sample.signOff));
  assert.ok(formatted.includes(sample.dateStr));
});
