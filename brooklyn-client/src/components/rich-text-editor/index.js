import React, { PureComponent } from "react";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import stripJs from "strip-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./editor.css";
import { getPastedImage, putPastedImage } from "../../containers/service";
import { getPastedImagesWithText } from "../../Utils";
import toolbarOptions from "./rich-text-options";
import {
  Modifier,
  EditorState,
  ContentState,
  convertToRaw,
  AtomicBlockUtils
} from "draft-js";
import renderHTML from "react-render-html";

export default class index extends PureComponent {
  state = {
    editorState: EditorState.createEmpty(),
    htmlString: "",
    isLoadingImage: false
  };
  mounted = true;
  minCharsInHtmlTag = 8;

  async componentDidMount() {
    const { text } = this.props;
    this.mounted = true;
    let htmlString = await getPastedImagesWithText(text);
    if (htmlString) {
      let imgIndex = htmlString.indexOf("img");
      htmlString =
        imgIndex > -1 && imgIndex < htmlString.indexOf("<p>")
          ? `<p>${htmlString}</p>`
          : htmlString;
      const editorState = this.htmlToEditorState(htmlString);
      editorState && this.setState({ editorState, htmlString });
      this.focusEditor();
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.isEditing !== this.props.isEditing) {
      this.focusEditor();
    }
    if (prevProps.text !== this.props.text) {
      const htmlString = await getPastedImagesWithText(this.props.text);
      this.setState(prevState => ({ ...prevState, htmlString }));
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onEditorStateChange = editorState => {
    if (this.state.editorState !== editorState && this.mounted) {
      this.setState({
        editorState
      });
    }
  };

  handleOnPaste = e => {
    const clipboard = e.clipboardData || window.clipboardData;
    if (!clipboard) return false;
    const { items } = clipboard;
    for (const item of items) {
      if (/rtf|html/.test(item.type)) return;
      if (/image/.test(item.type) && this.mounted) {
        this.pasteImage(item);
      } else {
        this.pastePlainText(e, clipboard);
      }
    }
  };

  pasteImage = async item => {
    if (!this.mounted) return;
    const { editorState } = this.state;
    this.setState({ isLoadingImage: true });
    let blob = item.getAsFile();
    let pastedImage = await putPastedImage([blob]);
    let image = await getPastedImage(pastedImage);
    this.setState({ isLoadingImage: false });
    this.insertImage(editorState, image);
  };

  pastePlainText = (e, clipboard) => {
    if (!e.target.classList.contains("DraftEditor-root")) return;
    e.preventDefault();
    const text = clipboard.getData("text/plain");
    if (!text) return;
    const newContent = Modifier.insertText(
      this.state.editorState.getCurrentContent(),
      this.state.editorState.getSelection(),
      text
    );
    this.onEditorStateChange(
      EditorState.push(this.state.editorState, newContent, "insert-characters")
    );
  };

  handleOnBlur = async e => {
    const {
      name,
      property,
      isEditing,
      handleEdit,
      editProperty,
      handleChange
    } = this.props;
    e.persist();
    const { editorState } = this.state;
    if (!isEditing || !this.mounted) return;
    const html = this.editorStateToHtml(editorState);
    if (!html) return;
    const safeHtml = await stripJs(html);
    if (handleChange && name) {
      let event = { ...e };
      event.target.name = name;
      event.target.value = safeHtml;
      handleChange(event);
      this.setState({ htmlString: safeHtml });
    }
    handleEdit && handleEdit(property, false);
    await (editProperty && editProperty(property, safeHtml));
  };

  htmlToEditorState = html => {
    if (!html || !this.mounted) return;
    const blocksFromHtml = htmlToDraft(html);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    return EditorState.createWithContent(contentState);
  };

  editorStateToHtml = editorState => {
    if (!editorState) return;
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };

  setEditorReference = ref => {
    this.editorReferece = ref;
  };

  linkCallback = link => {
    this.focusEditor();
    return link;
  };

  focusEditor = () => this.editorReferece && this.editorReferece.focus();

  insertImage = (editorState, src) => {
    if (!editorState || !src || !this.mounted) return;
    const height = "auto";
    const maxWidth = "100%";
    const entityData = { src, height, maxWidth };
    const entityKey = editorState
      .getCurrentContent()
      .createEntity("IMAGE", "MUTABLE", entityData)
      .getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      " "
    );
    newEditorState && this.onEditorStateChange(newEditorState);
    this.editorReferece && this.editorReferece.focus();
  };

  handleOnPastedText = () => false;

  handleOnDoubleClick = e => e.stopPropagation();

  render() {
    const { editorState, htmlString } = this.state;
    const { isEditing, renderOverview, disabled, itemId } = this.props;
    const hasHtmlContent =
      htmlString && htmlString.length > this.minCharsInHtmlTag;
    const htmlOverview = hasHtmlContent ? htmlString : "";
    const toolbar = toolbarOptions({
      linkCallback: this.linkCallback
    });
    return isEditing ? (
      <div
        onPaste={this.handleOnPaste}
        onDoubleClick={this.handleOnDoubleClick}
      >
        <Editor
          toolbar={toolbar}
          disabled={disabled}
          editorState={editorState}
          editorClassName="demo-editor"
          key={`rich-editor-${itemId || ""}`}
          wrapperClassName="rich-text-wrapper"
          onBlur={this.handleOnBlur}
          editorRef={this.setEditorReference}
          handlePastedText={this.handleOnPastedText}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    ) : (
      <div className="rich-text-wrapper">
        {renderOverview && renderOverview(renderHTML(htmlOverview))}
      </div>
    );
  }
}
