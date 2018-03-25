/*!
 * jquery.breakpoints.js
 *
 * Author: DAWN Inc.
 * Since:   2017-03-25
 * Update:  2017-03-25
 * Version: 1.0.0
 * License: MIT (http://www.opensource.org/licenses/mit-license.php, http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license)
 * Comment: 右記を参考に作成(右記を参考に作成(https://github.com/thecreation/breakpoints-js)
 */
(function($) {
    'use strict';

    /**
     * jQueryのデータにアクセスするキー 5桁のランダム値で値が干渉しないようにする
     * @type {String}
     */
    var GLOBAL_KEY = 'BREAKPOINT' + Math.floor(Math.random() * 90000) + 10000;

    /**
     * ブレイクポイントを管理するオブジェクトを生成する関数
     * @param  {Object|String} breakpoints 設定するブレイクポイントのオブジェクト
     * @return {undefined}     undefined
     */
    $.breakpoints = function breakpoints(breakpoints) {
        /**
         * 現在のブレイクポイントの情報
         * @type {Object}
         */
        var currentBreakpoints = $.data(window, GLOBAL_KEY);

        /**
         * ブレイクポイントの情報を格納するオブジェクト
         * @type {Object}
         */
        var newBreakpoints = {};

        // 引数がオブジェクトではない場合、何もせず終了する
        if ($.type(breakpoints) !== 'object') {
            return;
        }

        // 現在のブレイクポイントが設定されていない場合、新規に空のオブジェクトを生成・登録する
        if (!currentBreakpoints) {
            $.data(window, GLOBAL_KEY, {});

            currentBreakpoints = $.data(window, GLOBAL_KEY);
        }

        // ブレイクポイントの設定
        for (var key in breakpoints) {
            if (!breakpoints.hasOwnProperty(key)) {
                return;
            }

            /**
             * 新しいブレイクポイントの情報
             * @property {Object}   min       レイアウトの最小値
             * @property {Object}   max       レイアウトの最大値
             * @property {Object}   media     window.matchMedia() の返り値
             * @property {Function} isMatched このオブジェクトの media.matches を返す関数
             */
            newBreakpoints[key] = {
                min: null,
                max: null,
                media: null,
                isMatched: null
            };

            var min = breakpoints[key]['min'];
            var max = breakpoints[key]['max'];

            // 最小値のバリデーション
            if (min < 0) {
                min = null;
            }

            // 最大値のバリデーション
            if (max === Infinity) {
                max = null;
            }

            // 最小値・最大値の設定
            newBreakpoints[key]['min'] = min || 0;
            newBreakpoints[key]['max'] = max || Infinity;

            // window.matchMedia() の返り値の取得し、mediaを設定する
            if (min && max) {
                newBreakpoints[key]['media'] = window.matchMedia(
                    '(min-width: ' + min + 'px) and (max-width: ' + max + 'px)'
                );
            } else {
                if (!min && max) {
                    newBreakpoints[key]['media'] = window.matchMedia(
                        '(max-width: ' + max + 'px)'
                    );
                } else if (min && !max) {
                    newBreakpoints[key]['media'] = window.matchMedia(
                        '(min-width: ' + min + 'px)'
                    );
                }
            }

            // isMatched()関数の設定
            newBreakpoints[key]['isMatched'] = function() {
                return this.media.matches;
            };
        }

        // 現在のブレイクポイント情報を、新しいブレイクポイント情報で上書きする
        currentBreakpoints = $.extend(currentBreakpoints, newBreakpoints);
    };

    /**
     * ブレインクポイントの情報オブジェクトを取得する関数
     * @param  {String} key  情報を取得するブレイクポイントの名前
     * @param  {String} info ブレインクポイントの情報オブジェクトのキー
     * @return {Object|any|null} ブレインクポイントの情報オブジェクト または 特定のキーの値 または null
     */
    $.breakpoints.get = function(key, info) {
        var currentBreakpoints = $.data(window, GLOBAL_KEY);

        if (!currentBreakpoints) {
            return null;
        }

        if ($.type(key) === 'string') {
            if ($.type(info) === 'string') {
                return currentBreakpoints[key][info];
            } else {
                return currentBreakpoints[key];
            }
        }
    };

    /**
     * ブレイクポイントが合致するさいに呼び出されるコールバック関数を登録する関数
     * @param  {String}    key       ブレイクポイントの名前
     * @param  {Function}  fn        コールバック関数(thisはmatchMedia, 第1引数は event|null, 第2引数はブレインクポイントの情報オブジェクト)
     * @param  {Boolean}   immediate 登録時、ブレイクポイントが合致して場合にコールバック関数を呼び出すかどうか
     * @return {undefined} undefined
     */
    $.breakpoints.on = function(key, fn, immediate) {
        var obj = $.breakpoints.get(key);
        var matchMedia = $.type(obj) === 'object' ? obj['media'] : null;

        // matchMediaがなければ何もせず終了する
        if (!matchMedia) {
            return;
        }

        // コールバック関数の登録
        matchMedia.addListener(function(e) {
            // ブレイクポイントが合致していれば、引数のコールバック関数を呼び出す
            if (matchMedia.matches) {
                fn.apply(matchMedia, [e, obj]);
            }
        });

        // immediateにfalseが指定されていなければ、trueとする
        if (immediate !== false) {
            immediate = true;
        }

        // immediateがtrueで、ブレイクポイントが合致していれば、引数のコールバック関数を呼び出す
        if (immediate && matchMedia.matches) {
            fn.apply(matchMedia, [null, obj]);
        }
    };

    /**
     * ブレイクポイントが合致するさいに呼び出されるコールバック関数を解除する関数
     * @param  {String}    key       ブレイクポイントの名前
     * @param  {Function}  fn        解除するコールバック関数
     * @return {undefined} undefined
     */
    $.breakpoints.off = function(key, fn) {
        var obj = $.breakpoints.get(key);
        var matchMedia = $.type(obj) === 'object' ? obj['media'] : null;

        // matchMediaがなければ何もせず終了する
        if (!matchMedia) {
            return;
        }

        // コールバック関数の解除
        matchMedia.removeListener(fn);
    };
})(jQuery);
