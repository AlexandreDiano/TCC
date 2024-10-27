require 'test_helper'

class KeysControllerTest < ActionDispatch::IntegrationTest
  setup do
    @key = keys(:one)
  end

  test "should get index" do
    get keys_url, as: :json
    assert_response :success
  end

  test "should create key" do
    assert_difference('Key.count') do
      post keys_url, params: { key: { code: @key.code, description: @key.description, door_id: @key.door_id, user_id: @key.user_id } }, as: :json
    end

    assert_response 201
  end

  test "should show key" do
    get key_url(@key), as: :json
    assert_response :success
  end

  test "should update key" do
    patch key_url(@key), params: { key: { code: @key.code, description: @key.description, door_id: @key.door_id, user_id: @key.user_id } }, as: :json
    assert_response 200
  end

  test "should destroy key" do
    assert_difference('Key.count', -1) do
      delete key_url(@key), as: :json
    end

    assert_response 204
  end
end
