import strings from "../i18n/definitions";

export default function News() {
  function item(month, text) {
    return (
      <>
        <div
          style={{ textAlign: "left", marginLeft: "8px", marginRight: "8px" }}
        >
          <p>
            <small>[{month}]</small> {text}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>{strings.news}</h1>
      <h3>2023</h3>

      {item(
        strings.oct,
        "Tiago joins as the first researcher to work full-time on Zeeguu",
      )}

      {item(
        strings.oct,
        "Mircea is awarded a Villum Experiment grant to improve the infrastructure and conduct a longitudinal study with  1000 users for six months",
      )}

      <h2>2022</h2>

      {item(strings.oct, strings.moreThan1000Frenchies)}

      {item(strings.aug, strings.newsEmmaAndFrida)}

      <h2>2021</h2>
      {item(
        strings.aug,
        <>
          {strings.mirceaKeynoteAtEASEAI}
          <a href="https://easeai.github.io/" target="blank">
            EASEAI 2021 (<b>Education, Software Engineering, and AI 2021</b>)
          </a>
        </>,
      )}
      {item(strings.jul, <>{strings.betaTesters200K}</>)}
      {item(
        strings.feb,
        <>
          {strings.pernilleObtainsFundingPrefix}
          <a
            href="https://cip.ku.dk/english/projects-and-collaborations/towards-a-personalised-textbook---new-tools-and-new-methods/"
            target="blank"
          >
            {strings.pernilleObtainsFundingLinkTitle}
          </a>
          {strings.pernilleObtainsFundingSuffix}
        </>,
      )}
      <h2>2020</h2>
      {item(
        strings.jan,
        <>
          📄 {strings.procrastinationPaper}(
          <a
            href="https://github.com/Aiki-Extension/Aiki/blob/master/Aiki-Turning_Procrastination_into_Microlearning.pdf"
            target="blank"
          >
            Aiki - Turning Online Procrastination into Microlearning
          </a>
          )
        </>,
      )}
      {item(strings.sep, <>👨‍🎓 {strings.rotterdamStarts}</>)}
      {item(strings.aug, <> {strings.euroCall2020}</>)}
      {item(strings.jul, <>{strings.betaTesters40K}</>)}
      <h2>2019</h2>
      {item(strings.oct, <>{strings.betaTesters100K}</>)}
      {item(strings.sep, <>👩‍🎓 {strings.amsterdamStarts}</>)}
      {item(strings.aug, <>{strings.euroCall2019}</>)}
      <h2>2018</h2>
      {item(
        strings.jan,
        <>
          📄 {strings.asWeMayStudyPaper} (
          <a
            href="https://www.researchgate.net/publication/322489283_As_We_May_Study_Towards_the_Web_as_a_Personalized_Language_Textbook"
            target="blank"
          >
            As We May Study: Towards the Web as a Personalized Language Textbook
          </a>
          )
          <br />
          <br />
        </>,
      )}
      {item(strings.sep, <>👩‍🎓 {strings.groningenStarts}</>)}
      <h2>2017</h2>
      {item(strings.may, <> 👩‍🎓 {strings.gomarusStarts}</>)}
      <h2>2016</h2>
      {item(strings.dec, <> {strings.zeeguuIsReady}</>)}
    </>
  );
}
