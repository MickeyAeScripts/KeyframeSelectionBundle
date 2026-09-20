// SelectPreviousKeyframes.jsx
// Selects every keyframe BEFORE the playhead.
// Works on the selected layers, or on every layer when nothing is selected.
// Walks the whole property tree, so effects, masks, shape contents, text
// animators and Puppet pins are all included. Single undo step.
(function () {
    // ---- config (the four scripts in this bundle differ only in MODE) ------
    var CFG = {
        MODE: "previous",  // "following" | "previous" | "current" | "workarea"
        INCLUDE_PLAYHEAD: false,  // following/previous: also take a key sitting exactly on the playhead
        ADD_TO_SELECTION: false,  // true = keep already-selected keys and add to them
        SKIP_LOCKED: true         // leave locked layers alone
    };
    // -----------------------------------------------------------------------

    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) return;

    var t = comp.time;
    var EPS = comp.frameDuration / 4;
    var waStart = comp.workAreaStart;
    var waEnd = comp.workAreaStart + comp.workAreaDuration;

    function isMatch(kt) {
        switch (CFG.MODE) {
            case "following": return CFG.INCLUDE_PLAYHEAD ? (kt >= t - EPS) : (kt > t + EPS);
            case "previous":  return CFG.INCLUDE_PLAYHEAD ? (kt <= t + EPS) : (kt < t - EPS);
            case "current":   return Math.abs(kt - t) < EPS;
            case "workarea":  return kt >= waStart - EPS && kt <= waEnd + EPS;
        }
        return false;
    }

    function walk(group) {
        for (var p = 1; p <= group.numProperties; p++) {
            var prop;
            try { prop = group.property(p); } catch (e) { continue; }
            if (!prop) continue;
            if (prop.propertyType === PropertyType.PROPERTY) {
                selectKeys(prop);
            } else {
                walk(prop);
            }
        }
    }

    function selectKeys(prop) {
        var n;
        try { n = prop.numKeys; } catch (e) { return; }
        if (!n) return;
        // separated Position: the keys live on the X/Y/Z followers, not on the leader
        try { if (prop.isSeparationLeader && prop.dimensionsSeparated) return; } catch (e) {}
        for (var k = 1; k <= n; k++) {
            try {
                var want = isMatch(prop.keyTime(k));
                if (want) prop.setSelectedAtKey(k, true);
                else if (!CFG.ADD_TO_SELECTION) prop.setSelectedAtKey(k, false);
            } catch (e) {} // hidden / unselectable property
        }
    }

    var layers = comp.selectedLayers.slice(0);
    if (layers.length === 0) {
        for (var i = 1; i <= comp.numLayers; i++) layers.push(comp.layer(i));
    }

    app.beginUndoGroup("Select Previous Keyframes");
    try {
        for (var j = 0; j < layers.length; j++) {
            if (CFG.SKIP_LOCKED && layers[j].locked) continue;
            walk(layers[j]);
        }
    } finally {
        app.endUndoGroup();
    }
})();
