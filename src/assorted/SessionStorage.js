// Stores the date to the sessionStorage in the browser.
// This information is only kept in the tab, and it's lost whenever the user closes it.
// Can be useful to set variables that only last a single session, but should be reset next time
// users are back in the app.

const SessionStorage = {
  Keys: {
    AudioExercisesEnabled: "audio_exercises_enabled",
    AudioBeingPlayed: "audio_is_being_played",
    CelebrationModalShown: "celebration_modal_shown",
  },

  /**
   * @return {string}
   */
  getAudioExercisesEnabled: function () {
    return sessionStorage[this.Keys.AudioExercisesEnabled];
  },

  /**
   * @return {boolean}
   */
  isAudioExercisesEnabled: function () {
    // Session storage stores the values as strings, so we have to check based on
    // string equality.
    return sessionStorage[this.Keys.AudioExercisesEnabled] === "true";
  },
  /**
   * @param {boolean} is_enabled
   */
  setAudioExercisesEnabled: function (is_enabled) {
    sessionStorage[this.Keys.AudioExercisesEnabled] = is_enabled;
  },

  disableAudioExercises: function () {
    sessionStorage[this.Keys.AudioExercisesEnabled] = false;
  },

  /**
   * @return {boolean}
   */
  isCelebrationModalShown: function () {
    return sessionStorage[this.Keys.CelebrationModalShown] === "true";
  },

  /**
   * @param {boolean} is_shown
   */
  setCelebrationModalShown: function (is_shown) {
    sessionStorage[this.Keys.CelebrationModalShown] = is_shown;
  },
};

export default SessionStorage;
