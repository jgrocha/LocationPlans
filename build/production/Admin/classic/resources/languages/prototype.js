
String.prototype.translate = function() {
    var s = this.valueOf();
    // console.log('TRANSLATE: ' + s);
    var t = {},
        i = 0,
        n = Translation.length;
    while (i < n) {
        t = Translation[i];
        // console.log(t);
        if (t.id == s) {
            return t.translation;
        }
        i++;
    }
    return s;
};