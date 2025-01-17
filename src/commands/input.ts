import { outro } from '@clack/prompts'
import { adb, goBack, prompts2 } from '../utils'

const keyEvents: Record<string, string> = {
  text: 'text',
  key_unknown: 'shell input keyevent 0',
  key_soft_left: 'shell input keyevent 1',
  key_soft_right: 'shell input keyevent 2',
  key_home: 'shell input keyevent 3',
  key_back: 'shell input keyevent 4',
  key_call: 'shell input keyevent 5',
  key_endcall: 'shell input keyevent 6',
  key_0: 'shell input keyevent 7',
  key_1: 'shell input keyevent 8',
  key_2: 'shell input keyevent 9',
  key_3: 'shell input keyevent 10',
  key_4: 'shell input keyevent 11',
  key_5: 'shell input keyevent 12',
  key_6: 'shell input keyevent 13',
  key_7: 'shell input keyevent 14',
  key_8: 'shell input keyevent 15',
  key_9: 'shell input keyevent 16',
  key_star: 'shell input keyevent 17',
  key_pound: 'shell input keyevent 18',
  key_dpad_up: 'shell input keyevent 19',
  key_dpad_down: 'shell input keyevent 20',
  key_dpad_left: 'shell input keyevent 21',
  key_dpad_right: 'shell input keyevent 22',
  key_dpad_center: 'shell input keyevent 23',
  key_volume_up: 'shell input keyevent 24',
  key_volume_down: 'shell input keyevent 25',
  key_power: 'shell input keyevent 26',
  key_camera: 'shell input keyevent 27',
  key_clear: 'shell input keyevent 28',
  key_a: 'shell input keyevent 29',
  key_b: 'shell input keyevent 30',
  key_c: 'shell input keyevent 31',
  key_d: 'shell input keyevent 32',
  key_e: 'shell input keyevent 33',
  key_f: 'shell input keyevent 34',
  key_g: 'shell input keyevent 35',
  key_h: 'shell input keyevent 36',
  key_i: 'shell input keyevent 37',
  key_j: 'shell input keyevent 38',
  key_k: 'shell input keyevent 39',
  key_l: 'shell input keyevent 40',
  key_m: 'shell input keyevent 41',
  key_n: 'shell input keyevent 42',
  key_o: 'shell input keyevent 43',
  key_p: 'shell input keyevent 44',
  key_q: 'shell input keyevent 45',
  key_r: 'shell input keyevent 46',
  key_s: 'shell input keyevent 47',
  key_t: 'shell input keyevent 48',
  key_u: 'shell input keyevent 49',
  key_v: 'shell input keyevent 50',
  key_w: 'shell input keyevent 51',
  key_x: 'shell input keyevent 52',
  key_y: 'shell input keyevent 53',
  key_z: 'shell input keyevent 54',
  key_comma: 'shell input keyevent 55',
  key_period: 'shell input keyevent 56',
  key_alt_left: 'shell input keyevent 57',
  key_alt_right: 'shell input keyevent 58',
  key_shift_left: 'shell input keyevent 59',
  key_shift_right: 'shell input keyevent 60',
  key_tab: 'shell input keyevent 61',
  key_space: 'shell input keyevent 62',
  key_sym: 'shell input keyevent 63',
  key_explorer: 'shell input keyevent 64',
  key_envelope: 'shell input keyevent 65',
  key_enter: 'shell input keyevent 66',
  key_del: 'shell input keyevent 67',
  key_grave: 'shell input keyevent 68',
  key_minus: 'shell input keyevent 69',
  key_equals: 'shell input keyevent 70',
  key_left_bracket: 'shell input keyevent 71',
  key_right_bracket: 'shell input keyevent 72',
  key_backslash: 'shell input keyevent 73',
  key_semicolon: 'shell input keyevent 74',
  key_apostrophe: 'shell input keyevent 75',
  key_slash: 'shell input keyevent 76',
  key_at: 'shell input keyevent 77',
  key_num: 'shell input keyevent 78',
  key_headsethook: 'shell input keyevent 79',
  key_focus: 'shell input keyevent 80',
  key_plus: 'shell input keyevent 81',
  key_menu: 'shell input keyevent 82',
  key_notification: 'shell input keyevent 83',
  key_search: 'shell input keyevent 84',
  key_media_play_pause: 'shell input keyevent 85',
  key_media_stop: 'shell input keyevent 86',
  key_media_next: 'shell input keyevent 87',
  key_media_previous: 'shell input keyevent 88',
  key_media_rewind: 'shell input keyevent 89',
  key_media_fast_forward: 'shell input keyevent 90',
  key_mute: 'shell input keyevent 91',
  key_page_up: 'shell input keyevent 92',
  key_page_down: 'shell input keyevent 93',
  key_pictsymbols: 'shell input keyevent 94',
  key_switch_charset: 'shell input keyevent 95',
  key_button_a: 'shell input keyevent 96',
  key_button_b: 'shell input keyevent 97',
  key_button_c: 'shell input keyevent 98',
  key_button_x: 'shell input keyevent 99',
  key_button_y: 'shell input keyevent 100',
  key_button_z: 'shell input keyevent 101',
  key_button_l1: 'shell input keyevent 102',
  key_button_r1: 'shell input keyevent 103',
  key_button_l2: 'shell input keyevent 104',
  key_button_r2: 'shell input keyevent 105',
  key_button_thumbl: 'shell input keyevent 106',
  key_button_thumbr: 'shell input keyevent 107',
  key_button_start: 'shell input keyevent 108',
  key_button_select: 'shell input keyevent 109',
  key_button_mode: 'shell input keyevent 110',
  key_escape: 'shell input keyevent 111',
  key_forward_del: 'shell input keyevent 112',
  key_ctrl_left: 'shell input keyevent 113',
  key_ctrl_right: 'shell input keyevent 114',
  key_caps_lock: 'shell input keyevent 115',
  key_scroll_lock: 'shell input keyevent 116',
  key_meta_left: 'shell input keyevent 117',
  key_meta_right: 'shell input keyevent 118',
  key_function: 'shell input keyevent 119',
  key_sysrq: 'shell input keyevent 120',
  key_break: 'shell input keyevent 121',
  key_move_home: 'shell input keyevent 122',
  key_move_end: 'shell input keyevent 123',
  key_insert: 'shell input keyevent 124',
  key_forward: 'shell input keyevent 125',
  key_media_play: 'shell input keyevent 126',
  key_media_pause: 'shell input keyevent 127',
  key_media_close: 'shell input keyevent 128',
  key_media_eject: 'shell input keyevent 129',
  key_media_record: 'shell input keyevent 130',
  key_f1: 'shell input keyevent 131',
  key_f2: 'shell input keyevent 132',
  key_f3: 'shell input keyevent 133',
  key_f4: 'shell input keyevent 134',
  key_f5: 'shell input keyevent 135',
  key_f6: 'shell input keyevent 136',
  key_f7: 'shell input keyevent 137',
  key_f8: 'shell input keyevent 138',
  key_f9: 'shell input keyevent 139',
  key_f10: 'shell input keyevent 140',
  key_f11: 'shell input keyevent 141',
  key_f12: 'shell input keyevent 142',
  key_num_lock: 'shell input keyevent 143',
  key_numpad_0: 'shell input keyevent 144',
  key_numpad_1: 'shell input keyevent 145',
  key_numpad_2: 'shell input keyevent 146',
  key_numpad_3: 'shell input keyevent 147',
  key_numpad_4: 'shell input keyevent 148',
  key_numpad_5: 'shell input keyevent 149',
  key_numpad_6: 'shell input keyevent 150',
  key_numpad_7: 'shell input keyevent 151',
  key_numpad_8: 'shell input keyevent 152',
  key_numpad_9: 'shell input keyevent 153',
  key_numpad_divide: 'shell input keyevent 154',
  key_numpad_multiply: 'shell input keyevent 155',
  key_numpad_subtract: 'shell input keyevent 156',
  key_numpad_add: 'shell input keyevent 157',
  key_numpad_dot: 'shell input keyevent 158',
  key_numpad_comma: 'shell input keyevent 159',
  key_numpad_enter: 'shell input keyevent 160',
  key_numpad_equals: 'shell input keyevent 161',
  key_numpad_left_paren: 'shell input keyevent 162',
  key_numpad_right_paren: 'shell input keyevent 163',
  key_volume_mute: 'shell input keyevent 164',
  key_info: 'shell input keyevent 165',
  key_channel_up: 'shell input keyevent 166',
  key_channel_down: 'shell input keyevent 167',
  key_zoom_in: 'shell input keyevent 168',
  key_zoom_out: 'shell input keyevent 169',
  key_tv: 'shell input keyevent 170',
  key_window: 'shell input keyevent 171',
  key_guide: 'shell input keyevent 172',
  key_dvr: 'shell input keyevent 173',
  key_bookmark: 'shell input keyevent 174',
  key_captions: 'shell input keyevent 175',
  key_settings: 'shell input keyevent 176',
  key_tv_power: 'shell input keyevent 177',
  key_tv_input: 'shell input keyevent 178',
  key_stb_power: 'shell input keyevent 179',
  key_stb_input: 'shell input keyevent 180',
  key_avr_power: 'shell input keyevent 181',
  key_avr_input: 'shell input keyevent 182',
  key_prog_red: 'shell input keyevent 183',
  key_prog_green: 'shell input keyevent 184',
  key_prog_yellow: 'shell input keyevent 185',
  key_prog_blue: 'shell input keyevent 186',
  key_app_switch: 'shell input keyevent 187',
  key_button_1: 'shell input keyevent 188',
  key_button_2: 'shell input keyevent 189',
  key_button_3: 'shell input keyevent 190',
  key_button_4: 'shell input keyevent 191',
  key_button_5: 'shell input keyevent 192',
  key_button_6: 'shell input keyevent 193',
  key_button_7: 'shell input keyevent 194',
  key_button_8: 'shell input keyevent 195',
  key_button_9: 'shell input keyevent 196',
  key_button_10: 'shell input keyevent 197',
  key_button_11: 'shell input keyevent 198',
  key_button_12: 'shell input keyevent 199',
  key_button_13: 'shell input keyevent 200',
  key_button_14: 'shell input keyevent 201',
  key_button_15: 'shell input keyevent 202',
  key_button_16: 'shell input keyevent 203',
  key_language_switch: 'shell input keyevent 204',
  key_manner_mode: 'shell input keyevent 205',
  key_3d_mode: 'shell input keyevent 206',
  key_contacts: 'shell input keyevent 207',
  key_calendar: 'shell input keyevent 208',
  key_music: 'shell input keyevent 209',
  key_calculator: 'shell input keyevent 210',
  key_zenkaku_hankaku: 'shell input keyevent 211',
  key_eisu: 'shell input keyevent 212',
  key_muhenkan: 'shell input keyevent 213',
  key_henkan: 'shell input keyevent 214',
  key_katakana_hiragana: 'shell input keyevent 215',
  key_yen: 'shell input keyevent 216',
  key_ro: 'shell input keyevent 217',
  key_kana: 'shell input keyevent 218',
  key_assist: 'shell input keyevent 219',
  key_brightness_down: 'shell input keyevent 220',
  key_brightness_up: 'shell input keyevent 221',
  key_media_audio_track: 'shell input keyevent 222',
  key_sleep: 'shell input keyevent 223',
  key_wakeup: 'shell input keyevent 224',
  key_pairing: 'shell input keyevent 225',
  key_media_top_menu: 'shell input keyevent 226',
  key_11: 'shell input keyevent 227',
  key_12: 'shell input keyevent 228',
  key_last_channel: 'shell input keyevent 229',
  key_tv_data_service: 'shell input keyevent 230',
  key_voice_assist: 'shell input keyevent 231',
  key_tv_radio_service: 'shell input keyevent 232',
  key_tv_teletext: 'shell input keyevent 233',
  key_tv_number_entry: 'shell input keyevent 234',
  key_tv_terrestrial_analog: 'shell input keyevent 235',
  key_tv_terrestrial_digital: 'shell input keyevent 236',
  key_tv_satellite: 'shell input keyevent 237',
  key_tv_satellite_bs: 'shell input keyevent 238',
  key_tv_satellite_cs: 'shell input keyevent 239',
  key_tv_satellite_service: 'shell input keyevent 240',
  key_tv_network: 'shell input keyevent 241',
  key_tv_antenna_cable: 'shell input keyevent 242',
  key_tv_input_hdmi_1: 'shell input keyevent 243',
  key_tv_input_hdmi_2: 'shell input keyevent 244',
  key_tv_input_hdmi_3: 'shell input keyevent 245',
  key_tv_input_hdmi_4: 'shell input keyevent 246',
  key_tv_input_composite_1: 'shell input keyevent 247',
  key_tv_input_composite_2: 'shell input keyevent 248',
  key_tv_input_component_1: 'shell input keyevent 249',
  key_tv_input_component_2: 'shell input keyevent 250',
  key_tv_input_vga_1: 'shell input keyevent 251',
  key_tv_audio_description: 'shell input keyevent 252',
  key_tv_audio_description_mix_up: 'shell input keyevent 253',
  key_tv_audio_description_mix_down: 'shell input keyevent 254',
  key_tv_zoom_mode: 'shell input keyevent 255',
  key_tv_contents_menu: 'shell input keyevent 256',
  key_tv_media_context_menu: 'shell input keyevent 257',
  key_tv_timer_programming: 'shell input keyevent 258',
  key_help: 'shell input keyevent 259',
  key_navigate_previous: 'shell input keyevent 260',
  key_navigate_next: 'shell input keyevent 261',
  key_navigate_in: 'shell input keyevent 262',
  key_navigate_out: 'shell input keyevent 263',
  key_stem_primary: 'shell input keyevent 264',
  key_stem_1: 'shell input keyevent 265',
  key_stem_2: 'shell input keyevent 266',
  key_stem_3: 'shell input keyevent 267',
  key_dpad_up_left: 'shell input keyevent 268',
  key_dpad_down_left: 'shell input keyevent 269',
  key_dpad_up_right: 'shell input keyevent 270',
  key_dpad_down_right: 'shell input keyevent 271',
  key_media_skip_forward: 'shell input keyevent 272',
  key_media_skip_backward: 'shell input keyevent 273',
  key_media_step_forward: 'shell input keyevent 274',
  key_media_step_backward: 'shell input keyevent 275',
  key_soft_sleep: 'shell input keyevent 276',
  key_cut: 'shell input keyevent 277',
  key_copy: 'shell input keyevent 278',
  key_paste: 'shell input keyevent 279',
  key_system_navigation_up: 'shell input keyevent 280',
  key_system_navigation_down: 'shell input keyevent 281',
  key_system_navigation_left: 'shell input keyevent 282',
  key_system_navigation_right: 'shell input keyevent 283',
  key_all_apps: 'shell input keyevent 284',
  key_refresh: 'shell input keyevent 285',
}

export async function input(device: string | undefined) {
  const keys = Object.keys(keyEvents)
  const { value, cancelled } = await prompts2({
    type: 'autocomplete',
    name: 'value',
    message: 'select key',
    choices: keys.map(key => ({
      title: key,
      value: keyEvents[key],
    })),
    suggest: (input, choices) => Promise.resolve(choices.filter(it => it.title.includes(input))),
  })

  if (cancelled) {
    return goBack()
  }

  if (!value) {
    return outro('No key selected')
  }

  if (value === 'text') {
    const { text, cancelled } = await prompts2({
      type: 'text',
      name: 'text',
      message: 'enter text',
    })

    if (cancelled) {
      return goBack()
    }

    if (!text) {
      return outro('No text entered')
    }

    adb(`shell input text "${text}"`, device)

    return outro(`text "${text}" sent`)
  }

  adb(value, device)

  outro(`${value} sent`)
}
